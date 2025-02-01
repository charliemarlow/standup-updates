import { hasRecentMessage, postMessage } from "./slack";
import { generateStandupMessage } from "./llm";
import { fetchLogs } from "./notion";

const run = async () => {
  console.log("Checking if a recent standup message exists...");
  const hasRecent = await hasRecentMessage();

  if (hasRecent) {
    console.log("Recent standup message found, skipping standup creation.");
    return;
  }

  console.log("Fetching logs from Notion...");
  const logs = await fetchLogs();

  console.log("Generating standup message...");
  const standupMessage = await generateStandupMessage(logs);

  console.log("Posting message to Slack...");
  await postMessage(standupMessage);

  console.log("Standup message posted successfully!");
};

if (require.main === module) {
  run().catch((error) => {
    console.error("Error in standup service:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    process.exit(1);
  });
}
