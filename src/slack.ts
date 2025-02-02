import { WebClient } from "@slack/web-api";
import { config } from "./config";
import { MessageElement } from "@slack/web-api/dist/types/response/ConversationsHistoryResponse";

const slack = new WebClient(config.slackToken);

export const postMessage = async (message: string) => {
  const response = await slack.chat.postMessage({
    channel: config.slackChannel,
    text: message,
    unfurl_links: false,
    unfurl_media: false,
  });

  // Add a thread reply with the user mention
  await slack.chat.postMessage({
    channel: config.slackChannel,
    thread_ts: response.ts,
    text: `<@${config.slackUser}>`,
    unfurl_links: false,
    unfurl_media: false,
  });
};

const FOUR_HOURS_IN_MS = 4 * 60 * 60 * 1000;

const hasXReaction = (message: MessageElement) =>
  message.reactions?.some((reaction) => reaction.name === "x");

const isSuccessfulStandupUpdate = (message: MessageElement) =>
  !message.subtype && message.user === config.botUser && !hasXReaction(message);

export const hasRecentMessage = async (): Promise<boolean> => {
  const fourHoursAgo = new Date(Date.now() - FOUR_HOURS_IN_MS);
  const history = await slack.conversations.history({
    channel: config.slackChannel,
    oldest: String(Math.floor(fourHoursAgo.getTime() / 1000)),
  });

  if (!history.messages || history.messages.length === 0) {
    return false;
  }

  return history.messages.some((message) => isSuccessfulStandupUpdate(message));
};
