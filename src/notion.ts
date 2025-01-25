import { Client } from "@notionhq/client";
import { config } from "./config";
import { getLogCutoff, isCurrentLocalDate } from "./helpers/date";
import {
  BlockObjectResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";

export type NotionLogs = {
  today: string;
  previous: string | null;
};

const MAX_PARSING_DEPTH = 5;

const notion = new Client({ auth: config.notionToken });

const richTextToString = (richText: Array<RichTextItemResponse>): string =>
  richText.map((text) => text.plain_text).join("");

const blockToText = (block: BlockObjectResponse): string => {
  switch (block.type) {
    case "paragraph":
      return richTextToString(block.paragraph.rich_text);
    case "to_do":
      const checked = block.to_do.checked ? "[x]" : "[ ]";
      return `${checked} ${richTextToString(block.to_do.rich_text)}`;
    case "bulleted_list_item":
      return `• ${richTextToString(block.bulleted_list_item.rich_text)}`;
    case "numbered_list_item":
      return `${richTextToString(block.numbered_list_item.rich_text)}`;
    case "heading_1":
      return `# ${richTextToString(block.heading_1.rich_text)}`;
    case "heading_2":
      return `## ${richTextToString(block.heading_2.rich_text)}`;
    case "heading_3":
      return `### ${richTextToString(block.heading_3.rich_text)}`;
    case "toggle":
      return richTextToString(block.toggle.rich_text);
    case "quote":
      return `> ${richTextToString(block.quote.rich_text)}`;
    case "callout":
      return `💡 ${richTextToString(block.callout.rich_text)}`;
    case "code":
      return `\`\`\`${block.code.language}\n${richTextToString(
        block.code.rich_text
      )}\n\`\`\``;
    case "divider":
      return "---";
    default:
      return "";
  }
};

const traverseBlock = async (
  block: BlockObjectResponse,
  depth: number = 0
): Promise<string> => {
  if (depth > MAX_PARSING_DEPTH || !("type" in block)) {
    return "";
  }

  const extraSpace = "  ".repeat(depth);
  let text = blockToText(block);

  if (!text) return "";

  text = extraSpace + text;

  if ("has_children" in block && block.has_children) {
    const children = await notion.blocks.children.list({
      block_id: block.id,
    });

    const childContent = await Promise.all(
      children.results.map(async (child) => {
        if (!("type" in child)) return "";
        return await traverseBlock(child, depth + 1);
      })
    );

    const filteredChildContent = childContent.filter(Boolean);
    if (filteredChildContent.length > 0) {
      text += "\n" + filteredChildContent.join("\n").slice(0, -1);
    }
  }

  return text + "\n";
};

const getPageContent = async (pageId: string): Promise<string> => {
  const blocks = await notion.blocks.children.list({
    block_id: pageId,
  });

  const content = await Promise.all(
    blocks.results.map(async (block) => {
      if (!("type" in block)) return "";
      return await traverseBlock(block, 0);
    })
  );

  return content.filter(Boolean).join("\n");
};

export const fetchLogs = async (): Promise<NotionLogs> => {
  const response = await notion.databases.query({
    database_id: config.notionDatabaseId,
    filter: {
      and: [
        {
          property: "Created time",
          created_time: {
            on_or_after: getLogCutoff(),
          },
        },
      ],
    },
    page_size: 2, // Only need today and previous workday
    sorts: [{ property: "Created time", direction: "descending" }],
  });

  const todayLogs = response.results.find((page) => {
    if ("created_time" in page) {
      return isCurrentLocalDate(page.created_time);
    }
    return false;
  });

  if (!todayLogs) {
    throw new Error("No logs found for today");
  }

  const previousLogs = response.results[1];
  return {
    today: await getPageContent(todayLogs.id),
    previous: previousLogs ? await getPageContent(previousLogs.id) : null,
  };
};
