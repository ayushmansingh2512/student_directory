import httpx
import asyncio
import re

async def test_github_scraping_v2(username):
    print(f"Testing v2 for user: {username}")
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
    base_url = "https://github.com"
    profile_url = f"{base_url}/{username}"
    
    async with httpx.AsyncClient() as client:
        try:
            # Step 1: Get Profile
            print(f"Fetching profile: {profile_url}")
            response = await client.get(profile_url, headers=headers)
            if response.status_code != 200:
                print(f"Failed to fetch profile: {response.status_code}")
                return

            text = response.text
            
            # Step 2: Find include-fragment
            # src="/ayushmansingh2512?action=show&amp;controller=profiles&amp;tab=contributions&amp;user_id=ayushmansingh2512"
            match = re.search(r'<include-fragment\s+src="([^"]+)"', text)
            if not match:
                print("No include-fragment found")
                # Try looking for the specific one if there are multiple
                match = re.search(r'src="([^"]+tab=contributions[^"]+)"', text)
            
            if match:
                fragment_url = match.group(1).replace("&amp;", "&")
                full_url = f"{base_url}{fragment_url}"
                print(f"Found fragment URL: {full_url}")
                
                # Step 3: Fetch fragment
                headers["X-Requested-With"] = "XMLHttpRequest"
                resp2 = await client.get(full_url, headers=headers)
                if resp2.status_code == 200:
                    text2 = resp2.text
                    # print(f"Fragment HTML: {text2[:500]}...")
                    
                    # Step 4: Extract count
                    # Look for "255 contributions in the last year"
                    count_match = re.search(r'(\d+(?:,\d+)*)\s+contributions\s+in\s+the\s+last\s+year', text2)
                    if count_match:
                        print(f"SUCCESS! Count: {count_match.group(1)}")
                    else:
                        print("Could not find count in fragment HTML")
                        # Dump for inspection
                        with open("github_fragment_dump.html", "w", encoding="utf-8") as f:
                            f.write(text2)
                        print("Dumped fragment to github_fragment_dump.html")
                else:
                    print(f"Failed to fetch fragment: {resp2.status_code}")
            else:
                print("Could not find contribution fragment URL")

        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(test_github_scraping_v2("ayushmansingh2512"))
