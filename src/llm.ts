import Anthropic from "@anthropic-ai/sdk";
import { config } from "./config";
import { NotionLogs } from "./notion";

const anthropic = new Anthropic({ apiKey: config.anthropicApiKey });

export const generateStandupMessage = async (logs: NotionLogs) => {
  const prompt = `Generate a concise standup message based on these daily logs. 
  Ignore any items with (ignore) tag. Do not include any lines about catching up
  on Slack or posting an update.
  
  Format as:
  Last:
  - (key accomplishments)
  Next:
  - (planned tasks)

  If there are no last logs, just omit that section.
  Use Linear numbers for referencing tasks, but also a short summary based on the title.
  Make it sound like a human software engineer wrote it.
  Wrap the PR references and Linear references in Slack links.
  Always list all of the completed code reviews and their count.

  Today's logs: ${JSON.stringify(logs.today)}
  ${logs.previous && `Previous logs: ${JSON.stringify(logs.previous)}`}`;

  const message = await anthropic.messages.create({
    model: "claude-3-opus-20240229",
    max_tokens: 1000,
    messages: [{ role: "user", content: prompt }],
  });

  return message.content[0].text;
};
