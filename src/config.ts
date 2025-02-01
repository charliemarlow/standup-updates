import dotenv from "dotenv";

dotenv.config();

type Config = {
  notionToken: string;
  notionDatabaseId: string;
  slackToken: string;
  slackChannel: string;
  slackUser: string;
  botUser: string;
  anthropicApiKey: string;
};

const assertIsString = (key: string, value: unknown): string => {
  if (typeof value !== "string") {
    throw new Error(`Environment variable ${key} is not defined`);
  }

  return value;
};

export const config: Config = {
  notionToken: assertIsString("NOTION_TOKEN", process.env.NOTION_TOKEN),
  notionDatabaseId: assertIsString(
    "NOTION_DATABASE_ID",
    process.env.NOTION_DATABASE_ID
  ),
  slackToken: assertIsString("SLACK_TOKEN", process.env.SLACK_TOKEN),
  slackChannel: assertIsString("SLACK_CHANNEL", process.env.SLACK_CHANNEL),
  slackUser: assertIsString("SLACK_USER", process.env.SLACK_USER),
  botUser: assertIsString("BOT_USER", process.env.BOT_USER),
  anthropicApiKey: assertIsString(
    "ANTHROPIC_API_KEY",
    process.env.ANTHROPIC_API_KEY
  ),
};
