import httpx
import asyncio
import re

async def test_github_scraping(username):
    print(f"Testing for user: {username}")
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
    url = f"https://github.com/{username}"
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, headers=headers)
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == 200:
                text = response.text
                # print(f"HTML Preview: {text[:1000]}...") # Print first 1000 chars
                
                with open("github_dump.html", "w", encoding="utf-8") as f:
                    f.write(text)
                print("Dumped HTML to github_dump.html")

            else:
                print("Failed to fetch page")
                
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(test_github_scraping("ayushmansingh2512"))
