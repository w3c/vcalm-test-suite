# VCALM normative documentation

Artifacts generated from the published TR
([VCALM 1.0](https://www.w3.org/TR/vcalm-1.0/)) by scraping Respec
`class="rfc2119"` markers with BeautifulSoup.

| File | Purpose |
|------|---------|
| [normative-statements.html](normative-statements.html) | Overview metrics + side-by-side statement/spec panes |
| [normative-statements.md](normative-statements.md) | Section-grouped list |
| [normative-statements.json](normative-statements.json) | Machine-readable inventory |
| [scripts/scrape_normative.py](scripts/scrape_normative.py) | Regenerator |

```sh
# requires: beautifulsoup4, lxml
python3 docs/scripts/scrape_normative.py
```
