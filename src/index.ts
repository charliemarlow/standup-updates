import { postMessage } from "./slack";
import { generateStandupMessage } from "./llm";
import { fetchLogs } from "./notion";

const run = async (): Promise<void> => {
  try {
    console.log("Fetching logs from Notion...");
    const logs = await fetchLogs();

    console.log("Generating standup message...");
    const standupMessage = await generateStandupMessage(logs);

    console.log("Posting message to Slack...");
    await postMessage(standupMessage);

    console.log("Standup message posted successfully!");
  } catch (error) {
    console.error("Error in standup service:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
};

if (require.main === module) {
  run().catch(() => {
    process.exit(1);
  });
}
