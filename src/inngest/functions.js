import { inngest } from "./client";
import { Sandbox } from "@e2b/code-interpreter";
import {
  openai,
  createAgent,
  createTool,
  createNetwork,
  createState
} from "@inngest/agent-kit";
import {
  getSandbox,
  lastAssistantTextMessageContent,
} from "./utils";
import {
  PROMPT,
  FRAGMENT_TITLE_PROMPT,
  RESPONSE_PROMPT,
} from "@/prompt";
import { prisma } from "@/lib/db";

export const codeAgentFunction = inngest.createFunction(
  { id: "code-agent" },
  { event: "code-agent/run" },
  async ({ event, step }) => {

    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("kiddo-nextjs-test4");
      await sandbox.setTimeout(60_000 * 10 * 3);
      return sandbox.sandboxId;
    });

    const previousMessages = await step.run(
      "get-previous-messages",
      async () => {
        const formattedMessages = [];

        const messages = await prisma.message.findMany({
          where: { projectId: event.data.projectId },
          orderBy: { createdAt: "desc" },
          take: 5,
        });

        for (const message of messages) {
          formattedMessages.push({
            type: "text",
            role: message.role === "ASSISTANT" ? "assistant" : "user",
            content: message.content,
          });
        }

        return formattedMessages.reverse();
      }
    );

    const state = createState(
      { summary: "", files: {} },
      { messages: previousMessages }
    );

    // ---------------- TOOLS ----------------

const terminalTool = createTool({
  name: "terminal",
  description: "Use terminal",
  handler: async ({ command }, { step }) => {
    return await step.run("terminal", async () => {
      const sandbox = await getSandbox(sandboxId);
      const result = await sandbox.commands.run(command);
      return result.stdout;
    });
  }
});

const fileWriterTool = createTool({
  name: "createOrUpdateFile",
  description: "Write file",
  handler: async ({ files }, { step, network }) => {
    const sandbox = await getSandbox(sandboxId);

    for (const file of files || []) {
      await sandbox.files.write(file.path, file.content);
      network.state.data.files[file.path] = file.content;
    }
  }
});

const readFileTool = createTool({
  name: "readFile",
  description: "Read file",
  handler: async ({ files }, { step }) => {
    const sandbox = await getSandbox(sandboxId);
    const contents = [];

    for (const file of files || []) {
      const content = await sandbox.files.read(file);
      contents.push({ path: file, content });
    }

    return JSON.stringify(contents);
  }
});




    // ---------------- AGENT ----------------

    const codeAgent = createAgent({
      name: "code-agent",
      description: "An expert coding agent",
      system: PROMPT,
      model: openai({
        model: "gpt-4.1",
        defaultParameters: { temperature: 0.1 },
      }),
      tools: [terminalTool, fileWriterTool, readFileTool],
      lifecycle: {
        onResponse: async ({ result, network }) => {
          const lastAssistantMessageText =
            lastAssistantTextMessageContent(result);

          if (lastAssistantMessageText?.includes("<task_summary")) {
            network.state.data.summary = lastAssistantMessageText;
          }

          return result;
        },
      },
    });

    const network = createNetwork({
      name: "coding-agent-network",
      agents: [codeAgent],
      maxIter: 15,
      defaultState: state,
      router: async ({ network }) => {
        if (network.state.data.summary) return;
        return codeAgent;
      },
    });

    const result = await network.run(event.data.Value, { state });

    // ---------------- POST PROCESSING ----------------

    const fragmentTitleGenerator = createAgent({
      name: "fragment-title-generator",
      system: FRAGMENT_TITLE_PROMPT,
      model: openai({ model: "gpt-4.1" }),
    });

    const responseGenerator = createAgent({
      name: "response-generator",
      system: RESPONSE_PROMPT,
      model: openai({ model: "gpt-4.1" }),
    });

    const { output: fragmentTitleOutput } =
      await fragmentTitleGenerator.run(result.state.data.summary);

    const { output: responseOutput } =
      await responseGenerator.run(result.state.data.summary);

    const generateFragmentTitle = () =>
      fragmentTitleOutput?.[0]?.content || "Fragment";

    const generateResponse = () =>
      responseOutput?.[0]?.content || "Here you go";

    const isError =
      !result.state.data.summary ||
      Object.keys(result.state.data.files || {}).length === 0;

    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId);
      const host = sandbox.getHost(3000);
      return `https://${host}`;
    });

    await step.run("save-result", async () => {
      if (isError) {
        return prisma.message.create({
          data: {
            projectId: event.data.projectId,
            content: "Something went wrong. Please try again.",
            role: "ASSISTANT",
            type: "ERROR",
          },
        });
      }

      return prisma.message.create({
        data: {
          projectId: event.data.projectId,
          content: generateResponse(),
          role: "ASSISTANT",
          type: "RESULT",
          fragment: {
            create: {
              sandboxUrl,
              title: generateFragmentTitle(),
              files: result.state.data.files,
            },
          },
        },
      });
    });

    return {
      url: sandboxUrl,
      title: "Fragment",
      files: result.state.data.files,
      summary: result.state.data.summary,
    };
  }
);
