# standup-updates

Auto-posts standup updates from my daily logs in Notion

I keep daily TODOs in a notion database, and wanted to automate posting those updates to a Slack channel.

This script reads from that database, uses an LLM to summarize, and then posts the summary. This runs on a cron job in Github actions every weekday at 10 AM PT.
