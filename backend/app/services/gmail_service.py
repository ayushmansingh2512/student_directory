async def get_gmail_photo(email: str, github_username: str = None) -> str:
    """
    Generates an avatar URL using unavatar.io, which aggregates multiple providers 
    (Gravatar, etc.) and supports fallbacks.
    """
    # Priority 1: Use GitHub Avatar directly if username is provided
    if github_username:
        return f"https://github.com/{github_username}.png"

    # Priority 2: Use unavatar for email (Gravatar, etc.) with generic fallback
    return f"https://unavatar.io/{email}?fallback=https://source.boringavatars.com/beam/120/{email}"
