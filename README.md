# standup-updates

Auto-posts standup updates from my daily logs in Notion

I keep daily TODOs in a notion database, and wanted to automate posting those updates to a Slack channel.

This script reads from that database, uses an LLM to summarize, and then posts the summary. This runs on a cron job in Github actions every weekday at between 9-11 AM PST (8-10 AM PDT).

## What

- Checks for any updates in the last 4 hours that _don't_ have an X reacmoji. If there's an update, no-op.
- Reads logs from a Notion database
  - If there's no update for that day, fails. Will retry every 15 minutes for 2 hours every weekday.
  - If I'm OOO, will continue failing (which is fine, since it shouldn't post).
- Summarizes the updates using an LLM
  - There's a few special tokens/phrases that I use in my logs that the LLM knows how to handle
  - (ignore) Don't include this line in the summary
  - LLM: this is a user instruction, for example, I can ask the LLM to make everything rhyme in my update or add an inspirational quote at the start
  - "Remind me...", the message will end with a list of reminders
- Posts the summary to a Slack channel
  - Tags me in the thread, I'll get notified if anyone follows up
 
## Planned improvements

- Don't post if Slack catchup isn't checked yet
- Delete messages with an X reaction

## Future improvements (ideas)

- Parse Github and Linear URLs, use their APIs to fetch ticket & PR info + status and use it as part of the context
