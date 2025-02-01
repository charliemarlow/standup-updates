import { WebClient } from "@slack/web-api";
import { config } from "./config";

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
