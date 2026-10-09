"""Write an asset's natural size into the HTML tags that show it (shared by the pipelines)."""
from __future__ import annotations

import re


def set_size(html: str, tag: str, name: str, w: int, h: int) -> tuple[str, int]:
    """Set width/height on every <tag …> whose src or poster ends in /name, adding them if absent.
    Returns the new html and the number of tags touched."""
    n = 0

    def fix(m: re.Match) -> str:
        nonlocal n
        n += 1
        t = re.sub(r'\s(?:width|height)="[^"]*"', '', m.group(0))
        return re.sub(r'\s*(/?>)$', rf' width="{w}" height="{h}" \1', t, count=1)

    return re.sub(rf'<{tag}\b[^>]*\b(?:src|poster)="(?:[^"]*/)?{re.escape(name)}"[^>]*>', fix, html), n
