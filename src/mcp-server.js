#!/usr/bin/env node
const readline = require("readline");
const { getGibworkClient } = require("./client");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

const TOOLS = [
  {
    name: "gibwork_agent_status",
    description: "Get connected Solana agent wallet address and Gibwork configuration status",
    inputSchema: {
      type: "object",
      properties: {}
    }
  },
  {
    name: "gibwork_get_task",
    description: "Fetch details, requirements, reward, and deadline for a Gibwork bounty task",
    inputSchema: {
      type: "object",
      properties: {
        taskId: {
          type: "string",
          description: "Gibwork task/bounty UUID"
        }
      },
      required: ["taskId"]
    }
  },
  {
    name: "gibwork_list_submissions",
    description: "List all existing submissions for a specific Gibwork task",
    inputSchema: {
      type: "object",
      properties: {
        taskId: {
          type: "string",
          description: "Gibwork task/bounty UUID"
        }
      },
      required: ["taskId"]
    }
  },
  {
    name: "gibwork_submit_bounty",
    description: "Submit deliverable proof and notes to a Gibwork bounty signed by agent wallet",
    inputSchema: {
      type: "object",
      properties: {
        taskId: {
          type: "string",
          description: "Gibwork task/bounty UUID"
        },
        content: {
          type: "string",
          description: "Description of completed work and deliverable notes"
        },
        url: {
          type: "string",
          description: "Proof URL (GitHub repo, live artifact, tweet, demo link)"
        }
      },
      required: ["taskId", "content"]
    }
  }
];

async function handleToolCall(name, args) {
  const { client, signer, apiUrl } = getGibworkClient();

  switch (name) {
    case "gibwork_agent_status":
      return {
        wallet: signer.publicKey.toBase58(),
        apiUrl,
        status: "authenticated",
        framework: "Gibwork SDK + Solana Web3"
      };

    case "gibwork_get_task":
      const task = await client.tasks.get(args.taskId);
      return task;

    case "gibwork_list_submissions":
      const submissions = await client.submissions.list(args.taskId);
      return submissions;

    case "gibwork_submit_bounty":
      const result = await client.submissions.create(args.taskId, {
        content: args.content,
        url: args.url
      });
      return result;

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

function sendResponse(id, result, error = null) {
  const msg = {
    jsonrpc: "2.0",
    id
  };
  if (error) {
    msg.error = {
      code: -32603,
      message: error.message || String(error)
    };
  } else {
    msg.result = result;
  }
  process.stdout.write(JSON.stringify(msg) + "\n");
}

rl.on("line", async (line) => {
  if (!line.trim()) return;
  try {
    const req = JSON.parse(line);
    const { id, method, params } = req;

    if (method === "initialize") {
      sendResponse(id, {
        protocolVersion: "2024-11-05",
        capabilities: {
          tools: {}
        },
        serverInfo: {
          name: "gibwork-hermes-agent",
          version: "1.0.0"
        }
      });
    } else if (method === "tools/list") {
      sendResponse(id, {
        tools: TOOLS
      });
    } else if (method === "tools/call") {
      try {
        const toolResult = await handleToolCall(params.name, params.arguments || {});
        sendResponse(id, {
          content: [
            {
              type: "text",
              text: JSON.stringify(toolResult, null, 2)
            }
          ]
        });
      } catch (toolErr) {
        sendResponse(id, {
          isError: true,
          content: [
            {
              type: "text",
              text: `Error executing ${params.name}: ${toolErr.message}`
            }
          ]
        });
      }
    } else {
      sendResponse(id, null, { message: `Method not supported: ${method}` });
    }
  } catch (err) {
    // Malformed JSON
  }
});
