import httpx
from typing import Optional

async def get_leetcode_stats(username: str) -> Optional[int]:
    if not username:
        return 0
        
    try:
        url = "https://leetcode.com/graphql"
        query = """
        query userProblemsSolved($username: String!) {
            allQuestionsCount {
                difficulty
                count
            }
            matchedUser(username: $username) {
                submitStats {
                    acSubmissionNum {
                        difficulty
                        count
                        submissions
                    }
                }
            }
        }
        """
        variables = {"username": username}
        
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json={"query": query, "variables": variables})
            
            if response.status_code == 200:
                data = response.json()
                if "data" in data and "matchedUser" in data["data"] and data["data"]["matchedUser"]:
                    # Get total solved count
                    ac_submissions = data["data"]["matchedUser"]["submitStats"]["acSubmissionNum"]
                    # The first item usually is 'All'
                    for item in ac_submissions:
                        if item["difficulty"] == "All":
                            return item["count"]
                return 0
            else:
                print(f"LeetCode API Error: {response.status_code}")
                return None
    except Exception as e:
        print(f"Error fetching LeetCode stats: {e}")
        return None
