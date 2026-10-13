import json
import os
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import parse_qs, urlparse

import requests
from bs4 import BeautifulSoup


scholar_id = os.environ["GOOGLE_SCHOLAR_ID"]
base_url = "https://scholar.google.com/citations"
session = requests.Session()
session.headers.update(
    {
        "User-Agent": (
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
            "(KHTML, like Gecko) Chrome/131.0 Safari/537.36"
        )
    }
)

publications = []
name = ""
citedby = 0
for start in range(0, 1000, 100):
    response = session.get(
        base_url,
        params={"user": scholar_id, "hl": "en", "cstart": start, "pagesize": 100},
        timeout=(10, 30),
    )
    response.raise_for_status()
    soup = BeautifulSoup(response.text, "html.parser")
    if not name:
        profile_name = soup.select_one("#gsc_prf_in")
        if profile_name is None:
            raise RuntimeError("Google Scholar profile was not returned; the request may be blocked")
        name = profile_name.get_text(strip=True)
        citation_cells = soup.select("#gsc_rsb_st td.gsc_rsb_std")
        if citation_cells:
            citedby = int(citation_cells[0].get_text(strip=True) or 0)

    rows = soup.select(".gsc_a_tr")
    for row in rows:
        title_link = row.select_one(".gsc_a_at")
        citation_link = row.select_one(".gsc_a_c a")
        if title_link is None:
            continue
        relative_url = title_link.get("href", "")
        query = parse_qs(urlparse(relative_url).query)
        author_pub_id = query.get("citation_for_view", [""])[0]
        publications.append(
            {
                "title": title_link.get_text(" ", strip=True),
                "citations": int(citation_link.get_text(strip=True) or 0) if citation_link else 0,
                "author_pub_id": author_pub_id,
                "scholar_url": "https://scholar.google.com" + relative_url,
            }
        )
    if len(rows) < 100:
        break

result = {
    "scholar_id": scholar_id,
    "name": name,
    "citedby": citedby,
    "updated_at": datetime.now(timezone.utc).isoformat(),
    "publications": publications,
}

output_dir = Path(os.environ.get("OUTPUT_DIR", "results"))
output_dir.mkdir(parents=True, exist_ok=True)
(output_dir / "google-scholar.json").write_text(
    json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8"
)
