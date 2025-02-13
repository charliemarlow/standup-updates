import Anthropic from "@anthropic-ai/sdk";
import { config } from "./config";
import { NotionLogs } from "./notion";

const anthropic = new Anthropic({ apiKey: config.anthropicApiKey });

export const generateStandupMessage = async (logs: NotionLogs) => {
  const prompt = `Generate a concise standup message based on these daily logs. 
  Ignore any items with (ignore) tag. Do not include any lines about catching up
  on Slack or posting an update.

  Guidelines:
  • If there are no last logs, omit that section.
  • Use Linear numbers for referencing tasks, but also a short summary based on the title.
  • Make it sound like a human software engineer wrote it.
  • Wrap the PR references and Linear references in Slack links.
  • Always list all of the completed code reviews and their count.
  • If there are no code reviews, omit that section.
  • Don't include an emoji at the end unless the user requests it.
  • Follow any instructions on a line after LLM. That's a message for you, obey it.
    • Append reminders at the end, otherwise omit that section.
  
  <example_input>
  Previous logs:
  [x] Slack catchup
  [x] Code reviews
    [x] https://github.com/elicit/elicit-mono/pull/3230
    [x] https://github.com/elicit/elicit-mono/pull/3231
        [x] super long team review, spent an hour here
    [ ] https://github.com/elicit/elicit-mono/pull/3230
       [ ] Ran out of time
  [x] (ignore) Talk to James about something sensitive
  [x] https://linear.app/elicit-research/issue/ELI-5612/check-context-in-uploadertsx-for-correct-string-display
      [x] Investigate the issue
      [x] Write tests
      [x] Put up for review
      [x] Fix John feeback
      [x] merge
  [ ] https://linear.app/elicit-research/issue/ELI-5562/sign-up-upsell-and-statefulness-for-signed-out-guided-flow-users
      [x] Start work
      [ ] put up for review
      [ ] fix and merge
  [ ] LLM: Remind me to talk to Sarah about pricing
  [ ] LLM: Remind me to check in with the team about the new feature

  Today's logs:
  [x] Slack catchup
  [ ] Code reviews
      [ ] https://github.com/elicit/elicit-mono/pull/3241
      [ ] https://github.com/elicit/elicit-mono/pull/3240
      [ ] https://github.com/elicit/elicit-mono/pull/3230
  [ ] https://linear.app/elicit-research/issue/ELI-5562/sign-up-upsell-and-statefulness-for-signed-out-guided-flow-users
      [ ] put up for review
      [ ] fix and merge
  [ ] (ignore) get more tickets once done
  [ ] LLM: append your favorite emoji to the standup message
  [ ] LLM: Use the word "continue" in the next section
  </example_input>

  <example_output>
  Last:
  • reviewed 2 PRs (<https://github.com/elicit/elicit-mono/pull/3230|#3230>, <https://github.com/elicit/elicit-mono/pull/3231|#3231>)
  • completed <https://linear.app/elicit-research/issue/ELI-5612/check-context-in-uploadertsx-for-correct-string-display|ELI-5612: check context in uploadertsx for correct string display>
  • started on <https://linear.app/elicit-research/issue/ELI-5562/sign-up-upsell-and-statefulness-for-signed-out-guided-flow-users|ELI-5562: sign up upsell and statefulness for signed out guided flow users>

  Next:
  • 3 PR reviews in my queue (<https://github.com/elicit/elicit-mono/pull/3241|#3241>, <https://github.com/elicit/elicit-mono/pull/3240|#3240>, <https://github.com/elicit/elicit-mono/pull/3230|#3230>)
  • continue work on <https://linear.app/elicit-research/issue/ELI-5562/sign-up-upsell-and-statefulness-for-signed-out-guided-flow-users|ELI-5562: sign up upsell and statefulness for signed out guided flow users>
    • hoping to put up for review & merge today

  Reminders for charlie:
  • talk to Sarah about pricing
  • check in with the team about the new feature
  
  🌚
  </example_output>

  ${logs.previous && `Previous logs: ${JSON.stringify(logs.previous)}`}
  Today's logs: ${JSON.stringify(logs.today)}`;

  const message = await anthropic.messages.create({
    model: "claude-3-opus-20240229",
    max_tokens: 1000,
    messages: [{ role: "user", content: prompt }],
  });

  return message.content[0].text;
};
