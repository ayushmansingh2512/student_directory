import requests
from bs4 import BeautifulSoup
import logging
from datetime import datetime
from typing import List, Dict, Optional

logger = logging.getLogger(__name__)

class MoodleClient:
    LOGIN_URL = "http://lms.kiet.edu/moodle/login/index.php"
    CALENDAR_URL = "http://lms.kiet.edu/moodle/calendar/view.php"
    
    def __init__(self, username, password):
        self.username = username
        self.password = password
        self.session = requests.Session()
        self.is_logged_in = False

    def login(self) -> bool:
        """Logs into Moodle using provided credentials."""
        try:
            # Get login token first
            login_page = self.session.get(self.LOGIN_URL)
            soup = BeautifulSoup(login_page.content, 'html.parser')
            logintoken_input = soup.find('input', {'name': 'logintoken'})
            
            if not logintoken_input:
                logger.error("Could not find login token")
                return False
                
            logintoken = logintoken_input.get('value')
            
            payload = {
                'username': self.username,
                'password': self.password,
                'logintoken': logintoken
            }
            
            response = self.session.post(self.LOGIN_URL, data=payload)
            
            # Check for success (usually redirects to dashboard or has logout button)
            if "Log out" in response.text or "Dashboard" in response.title.text:
                self.is_logged_in = True
                return True
            else:
                logger.warning(f"Login failed. Title: {soup.title.string if soup.title else 'No Title'}")
                # Debug: print to console to be visible in agent logs
                print(f"DEBUG: Login failed for user {self.username}. Page Title: {soup.title.string if soup.title else 'No Title'}") 
                return False
                
        except Exception as e:
            logger.error(f"Error during Moodle login: {e}")
            return False

    def get_assignments(self) -> Dict[str, List[Dict]]:
        """
        Fetches assignments from the Calendar.
        Returns a dict with 'pending' and 'completed' lists.
        Since Moodle scraping is tricky, we'll infer status based on date for now.
        """
        if not self.is_logged_in:
            if not self.login():
                 raise ValueError("Login failed")

        try:
            # Step 1: Fetch Dashboard to get Teacher Mapping (Course -> Teacher)
            # We need this for enriching assignments from any source
            # This is an extra request but necessary for the "Teacher" requirement
            response_my = self.session.get("http://lms.kiet.edu/moodle/my/")
            soup_my = BeautifulSoup(response_my.content, 'html.parser')
            course_map = self._scrape_course_mapping(soup_my)
            logger.info(f"Found {len(course_map)} courses with teachers.")

            # Step 2: Fetch Assignments from Calendar (Preferred Source)
            response_cal = self.session.get(self.CALENDAR_URL + "?view=upcoming")
            soup_cal = BeautifulSoup(response_cal.content, 'html.parser')
            
            assignments = []
            
            # Selector Strategy 1: Standard 'event' div (Boost theme)
            events = soup_cal.find_all('div', class_='event')
            if not events: events = soup_cal.find_all('div', class_='calendar_event_item')
            if not events: events = soup_cal.find_all('div', class_='card')
            if not events: events = soup_cal.find_all('li', class_='list-group-item')

            for event in events:
                title_elem = (
                    event.find('h3', class_='name') or 
                    event.find('a', class_='card-link') or
                    event.find('a', class_='event-title') or
                    event.find('h3', class_='h5')
                )
                date_elem = (
                    event.find('div', class_='date') or 
                    event.find('div', class_='row') or
                    event.find('div', class_='text-muted')
                )
                course_elem = (
                    event.find('div', class_='course') or
                    event.find('span', class_='course') or
                    event.find('div', class_='col-11') or
                    event.find('small')
                )

                if title_elem:
                    title = title_elem.get_text(strip=True)
                    date_str = date_elem.get_text(strip=True) if date_elem else "Upcoming"
                    
                    course = "Moodle Course"
                    if course_elem:
                        course_text = course_elem.get_text(strip=True)
                        if len(course_text) < 50: 
                            course = course_text
                    
                    # Heuristic for course code in title
                    if ":" in title:
                         parts = title.split(":", 1)
                         prefix = parts[0].strip()
                         if len(prefix) < 15 and any(c.isdigit() for c in prefix): 
                             course = prefix
                             title = parts[1].strip()

                    if len(date_str) > 50: 
                        date_str = "See detailed view"
                    
                    # Enrich with Teacher
                    clean_course = self.clean_course_name(course)
                    teacher = self._find_teacher_for_course(clean_course, course_map)
                    display_course = f"{clean_course} ({teacher})" if teacher else clean_course

                    assignments.append({
                        "title": title,
                        "course": display_course,
                        "status": "Left",
                        "date": date_str
                    })

            # Step 3: Fallback - Check Dashboard Timeline if Calendar is empty
            if not assignments:
                logger.info("Calendar returned no assignments, checking Dashboard Timeline...")
                timeline_events = soup_my.find_all('div', class_='event-list-item') or \
                                  soup_my.find_all('div', {'data-region': 'event-list-item'}) or \
                                  soup_my.find_all('li', class_='list-group-item')

                for event in timeline_events:
                    title_elem = event.find('h6', class_='event-name') or event.find('h3') or event.find('a')
                    date_elem = event.find('div', class_='text-muted') or event.find('time')
                    
                    course_name = "Moodle Course"
                    links = event.find_all('a', href=True)
                    for link in links:
                        if 'course/view.php' in link['href']:
                             course_name = link.get_text(strip=True)
                             break
                    
                    if title_elem:
                        title = title_elem.get_text(strip=True)
                        date_str = date_elem.get_text(strip=True) if date_elem else "Upcoming"
                        
                        clean_course = self.clean_course_name(course_name)
                        teacher = self._find_teacher_for_course(clean_course, course_map)
                        display_course = f"{clean_course} ({teacher})" if teacher else clean_course

                        assignments.append({
                            "title": title,
                            "course": display_course,
                            "status": "Left",
                            "date": date_str
                        })

            return self.process_assignments(assignments)
    
        except Exception as e:
            logger.error(f"Error fetching assignments: {e}")
            # Re-raise invalid credentials or return empty
            if "Login failed" in str(e):
                raise e
            return {"pending": [], "completed": []}

    def _scrape_course_mapping(self, soup) -> Dict[str, str]:
        """
        Scrapes the 'Course Overview' block to find {CourseName: TeacherName}.
        Based on user snippet: "Mr. Ankit Verma \n Course name..."
        """
        mapping = {}
        # Look for cards or dashboard items
        courses = soup.find_all('div', class_='dashboard-card') or \
                  soup.find_all('div', class_='course-info-container') or \
                  soup.find_all('div', class_='card-body') # Generic card body often has it
                  
        for c in courses:
             # Course Name
            name_elem = c.find('span', class_='multiline') # Moodle 4.0 standard
            if not name_elem:
                name_elem = c.find('h6')
            
            # Teacher Name
            teacher_elem = c.find('div', class_='text-muted') 
            
            if name_elem:
                 c_name = self.clean_course_name(name_elem.get_text(strip=True))
                 if teacher_elem:
                     t_name = teacher_elem.get_text(strip=True)
                     if len(t_name) < 40 and "Category" not in t_name:
                         mapping[c_name] = t_name
        
        return mapping

    def _find_teacher_for_course(self, course_name, mapping):
        # Fuzzy match course name to mapping keys
        for k, v in mapping.items():
            if course_name in k or k in course_name:
                return v
        return None


    def fetch_calendar_month(self):
        """Fallback: Parse month view for events."""
        # This is a placeholder for more complex parsing. 
        # For now, let's return empty if the simple scrape fails, 
        # to avoid blocking the user with broken code.
        return {"pending": [], "completed": []}

    def process_assignments(self, raw_assignments) -> Dict[str, List[Dict]]:
        """Categorizes assignments into Done (past) and Left (future)."""
        pending = []
        completed = []
        now = datetime.now()
        
        from dateutil import parser
        
        for assign in raw_assignments:
            date_str = assign['date']
            try:
                # remove "Time:" prefix if present or other clutter
                clean_date = date_str.replace("Time:", "").strip()
                # Parse date - explicit fuzzy=True allows handling extra text
                due_date = parser.parse(clean_date, fuzzy=True, dayfirst=True)
                
                # If no year is in the string, dateutil defaults to current year which is usually correct for upcoming
                # However for "Friday, 12 January" in Dec, it might be next year.
                # Heuristic: if due_date is more than 6 months in the past, maybe it's next year? 
                # But Moodle usually includes year if it's not current year.
                
                if due_date < now:
                    assign['status'] = "Done" # Or Overdue, but user asked for "Done" count logic
                    completed.append(assign)
                else:
                    # Check for explicit submission status in title (since we don't grab full text for all)
                    # Or relying on the fact that we might have grabbed extra text in title/date
                    # This is brittle. Best way is to mark "Done" if "submitted" is in the title.
                    # But often "submitted" text is in a separate div we didn't capture in 'title'
                    
                    # Heuristic: If title contains "submitted", mark as done.
                    if "submitted" in assign['title'].lower() or "graded" in assign['title'].lower():
                        assign['status'] = "Done"
                        completed.append(assign)
                    else:
                        pending.append(assign)
                    
            except Exception as e:
                # specific logging for date parse failure
                logger.warning(f"Could not parse date: {date_str} - {e}")
                # Default to pending if we can't tell
                pending.append(assign)
        
        # Post-process course names
        for assign in pending + completed:
            assign['course'] = self.clean_course_name(assign['course'])

        return {
            "pending": pending,
            "completed": completed
        }

    def clean_course_name(self, raw_name: str) -> str:
        """
        Cleans messy Moodle course names.
        e.g. "2025-26_Web Development-1_CA102B_I_B_ANK" -> "Web Development-1"
        """
        if not raw_name or raw_name == "Moodle Course":
            return raw_name
            
        # Common patterns to strip
        # 1. Year prefixes like "2025-26_"
        import re
        name = re.sub(r'^\d{4}-\d{2}[_ ]*', '', raw_name) # Remove 2025-26_
        
        # 2. Semester/Code suffixes like "_CA102B_I_B_ANK"
        # We look for the first occurrence of huge underscores or code-like blocks
        parts = name.split('_')
        if len(parts) > 1:
            # Heuristic: Take the parts that look like real words
            clean_parts = []
            for p in parts:
                if any(c.isdigit() for c in p) and len(p) > 4: # Likely a code "CA102B"
                    break
                clean_parts.append(p)
            
            if clean_parts:
                new_name = " ".join(clean_parts).strip()
                # If we stripped everything, revert
                if len(new_name) > 2:
                    name = new_name

        # 3. Strip "2025-26" if inside
        name = name.replace("2025-26", "").strip()
        
        # 4. Remove "Course name" prefix if scraper captured it
        name = name.replace("Course name", "").strip()
        
        return name
