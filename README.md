# standup-updates

Auto-posts standup updates from my daily logs in Notion

I keep daily TODOs in a notion database, and wanted to automate posting those updates to a Slack channel.

This script reads from that database, uses an LLM to summarize, and then posts the summary. This runs on a cron job in Github actions every weekday at 10 AM PT.

## Planned improvements

- Add something to prompt to take user instruction (I want to prompt it from my notes a little more reliably)
- Update prompt to always use linear titles in links, not just numbers (provide an example output)
- Better retries... ideally I can run this multiple times throughout the morning but then stop early if there's already a slack message with no ❌ reacomji
  - DST resistant (idea: run it pretty early with 2 hours of retries so 9 am to 10 am is always covered)

## Future improvements (ideas)

- Parse Github and Linear URLs, use their APIs to fetch ticket & PR info + status and use it as part of the context
