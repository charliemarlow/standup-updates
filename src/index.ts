import { hasRecentMessage, postMessage } from "./slack";
import { generateStandupMessage } from "./llm";
import { fetchLogs } from "./notion";

const log = (
  message: string,
  level: "info" | "error" = "info",
  error?: Error
) => {
  const timestamp = new Date().toISOString();
  const prefix = level === "error" ? "❌" : "📝";
  const formattedMessage = `${prefix} [${timestamp}] ${message}`;

  if (level === "error") {
    console.error(formattedMessage, {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
  } else {
    console.log(formattedMessage);
  }
};

const run = async () => {
  log("Checking for recent standup message");
  const hasRecent = await hasRecentMessage();

  if (hasRecent) {
    log("Recent standup message found, skipping standup creation.");
    return;
  }

  log("No recent standup message found, fetching logs");
  const logs = await fetchLogs();

  log("Generating standup message");
  const standupMessage = await generateStandupMessage(logs);

  log("Posting message to Slack");
  await postMessage(standupMessage);

  log("Standup message posted successfully!");
};

if (require.main === module) {
  run().catch((error) => {
    log("Error in standup service", "error", error);
    process.exit(1);
  });
}
