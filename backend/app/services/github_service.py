import httpx
import os

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")

async def get_github_commits(username: str) -> int:
    if not username:
        return 0
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
    if GITHUB_TOKEN:
        headers["Authorization"] = f"token {GITHUB_TOKEN}"

    async with httpx.AsyncClient() as client:
        # Method 1: GraphQL (Best, but requires Token)
        if GITHUB_TOKEN:
            try:
                query = """
                query($login: String!) {
                    user(login: $login) {
                        contributionsCollection {
                            totalCommitContributions
                        }
                    }
                }
                """
                response = await client.post(
                    "https://api.github.com/graphql",
                    json={"query": query, "variables": {"login": username}},
                    headers=headers
                )
                if response.status_code == 200:
                    data = response.json()
                    if "data" in data and data["data"]["user"]:
                        return data["data"]["user"]["contributionsCollection"]["totalCommitContributions"]
            except Exception as e:
                print(f"GitHub GraphQL Error: {e}")

        # Method 2: Scraping (Fallback, works without token)
        try:
            import re
            scrape_headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            }
            url = f"https://github.com/{username}"
            response = await client.get(url, headers=scrape_headers)
            
            if response.status_code == 200:
                text = response.text
                # Find the include-fragment src for contributions
                match = re.search(r'<include-fragment\s+src="([^"]+)"', text)
                if not match:
                    match = re.search(r'src="([^"]+tab=contributions[^"]+)"', text)
                
                if match:
                    fragment_url = match.group(1).replace("&amp;", "&")
                    # Ensure we have a valid URL path
                    if not fragment_url.startswith("http"):
                        fragment_url = f"https://github.com{fragment_url}"
                    
                    # Fetch fragment with AJAX header
                    fragment_headers = scrape_headers.copy()
                    fragment_headers["X-Requested-With"] = "XMLHttpRequest"
                    
                    resp2 = await client.get(fragment_url, headers=fragment_headers)
                    if resp2.status_code == 200:
                        text2 = resp2.text
                        count_match = re.search(r'(\d+(?:,\d+)*)\s+contributions\s+in\s+the\s+last\s+year', text2)
                        if count_match:
                            return int(count_match.group(1).replace(',', ''))
        except Exception as e:
            print(f"GitHub Scraping Error: {e}")

        # Method 3: Events API (Last resort, only recent events)
        try:
            url = f"https://api.github.com/users/{username}/events/public"
            response = await client.get(url, headers=headers)
            if response.status_code == 200:
                events = response.json()
                commit_count = 0
                for event in events:
                    if event["type"] == "PushEvent":
                        commit_count += event["payload"].get("size", 0)
                return commit_count
        except Exception:
            pass

    return 0
