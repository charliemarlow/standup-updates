import { WebClient } from "@slack/web-api";
import { config } from "./config";

const slack = new WebClient(config.slackToken);

export const postMessage = async (message: string) => {
  // append the slack user to the message
  const messageWithUser = `${message}\n\n cc <@${config.slackUser}>`;
  await slack.chat.postMessage({
    channel: config.slackChannel,
    text: messageWithUser,
    unfurl_links: false,
    unfurl_media: false,
  });
};
