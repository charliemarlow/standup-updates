# standup-updates

Auto-posts standup updates from my daily logs in Notion

I keep daily TODOs in a notion database, and wanted to automate posting those updates to a Slack channel.

This script reads from that database, uses an LLM to summarize, and then posts the summary. This runs on a cron job in Github actions every weekday at 10 AM PT.

## Planned improvements

- Add something to prompt to take user instruction (I want to prompt it from my notes a little more reliably)
- Update prompt to always use linear titles in links, not just numbers (provide an example output)

## Future improvements (ideas)

- Parse Github and Linear URLs, use their APIs to fetch ticket & PR info + status and use it as part of the context
