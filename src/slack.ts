import { WebClient } from "@slack/web-api";
import { config } from "./config";

const slack = new WebClient(config.slackToken);

export const postMessage = async (message: string) => {
  await slack.chat.postMessage({
    channel: config.slackChannel,
    text: message,
    unfurl_links: false,
    unfurl_media: false,
  });
};
