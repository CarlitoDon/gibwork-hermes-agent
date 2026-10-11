# Gibwork Hermes Agent ⚡️

> **Autonomous Web3 Bounty Hunter & MCP Server for the Gibwork Marketplace**  
> Built for the **Gibwork Developer Hackathon ($1,000 USDC Bounty)**.

---

## 🎯 Overview & Problem Solved

Traditional Web3 bounty hunting requires constant manual browser monitoring, manual social task completion, and manual wallet transaction signing. 

**`gibwork-hermes-agent`** is a non-web-app developer tool that connects autonomous AI coding agents (such as **Hermes Agent**, **Claude Desktop**, and **Cursor**) directly to the **Gibwork Marketplace** via the **Model Context Protocol (MCP)** and `@gibwork/sdk`.

### Key Capabilities
- 🤖 **Agentic Autonomy**: AI agents can query live Gibwork bounties, inspect deliverables, and submit proof without touching a browser.
- 🔐 **Zero-Friction Keypair Signing**: Automatically derives detached Ed25519 signatures from local Solana keypairs (`~/.config/solana/burner_wallet.json`) for cryptographically authenticated submissions.
- 🛠️ **Dual Interface**: Operable as a terminal CLI utility (`gibwork-agent`) or as a background JSON-RPC stdio MCP server (`gibwork-agent-mcp`).

---

## 🏗️ Architecture

```
┌────────────────────────────────────────────────────────┐
│     Autonomous Agent Runtime (Hermes / Claude / LLM)    │
└───────────────────────────┬────────────────────────────┘
                            │  JSON-RPC over stdio
                            ▼
┌────────────────────────────────────────────────────────┐
│             gibwork-agent-mcp (MCP Server)             │
│   • gibwork_agent_status       • gibwork_get_task      │
│   • gibwork_list_submissions   • gibwork_submit_bounty │
└───────────────────────────┬────────────────────────────┘
                            │  Node.js API calls
                            ▼
┌────────────────────────────────────────────────────────┐
│                   @gibwork/sdk Wrapper                 │
│   • Solana Ed25519 Signer (tweetnacl / @solana/web3.js)│
│   • Deterministic Keypair Loader (~/.config/solana)    │
└───────────────────────────┬────────────────────────────┘
                            │  HTTPS (REST / RPC)
                            ▼
┌────────────────────────────────────────────────────────┐
│              Gibwork External API (sdk.gib.work)       │
└────────────────────────────────────────────────────────┘
```

---

## 🚀 Quickstart & Installation

### 1. Prerequisites
- Node.js >= 18.0.0
- Solana keypair at `~/.config/solana/burner_wallet.json` (or custom path)

### 2. Setup
```bash
git clone https://github.com/CarlitoDon/gibwork-hermes-agent.git
cd gibwork-hermes-agent
npm install
npm link
```

### 3. Verify Agent Wallet Status
```bash
gibwork-agent status
```
*Output:*
```text
==================================================
⚡️ GIBWORK AGENT STATUS
==================================================
Agent Public Key: 9Qx23YsWdv4FSDMQBMBWTE5bGLtYRLNxLvWzTz9fKmU
API URL         : https://sdk.gib.work
Keypair Source  : Burner Wallet (~/.config/solana/burner_wallet.json)
Status          : Ready for Autonomous Bounty Hunting
```

---

## 💻 CLI Commands

### Inspect a Bounty
```bash
gibwork-agent task <taskId>
```

### List Submissions for a Bounty
```bash
gibwork-agent submissions <taskId>
```

### Submit Work from Terminal
```bash
gibwork-agent submit <taskId> \
  --url "https://github.com/CarlitoDon/my-submission" \
  --content "Implemented automated MCP tool and tested live on Solana devnet."
```

---

## 🔌 MCP Integration (Hermes Agent & Claude Desktop)

To enable your autonomous agent to discover and solve Gibwork bounties, add the server to your agent configuration:

### For Hermes Agent (`~/.hermes/config.yaml` or `config.json`):
```json
{
  "mcpServers": {
    "gibwork": {
      "command": "node",
      "args": ["/Users/wecik/bounty-pipeline/gibwork-agent/src/mcp-server.js"]
    }
  }
}
```

### For Claude Desktop (`~/Library/Application Support/Claude/claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "gibwork": {
      "command": "node",
      "args": ["/absolute/path/to/gibwork-agent/src/mcp-server.js"]
    }
  }
}
```

### Supported MCP Tools
| Tool Name | Parameters | Purpose |
| :--- | :--- | :--- |
| `gibwork_agent_status` | *None* | Verifies connected Solana wallet and API connectivity. |
| `gibwork_get_task` | `taskId: string` | Retrieves task metadata, reward, deadline, and scope. |
| `gibwork_list_submissions`| `taskId: string` | Inspects competitor submissions and review state. |
| `gibwork_submit_bounty` | `taskId: string`, `content: string`, `url?: string` | Submits signed work directly from agent context. |

---

## 🧪 Testing & Verification

Run the automated test suite:
```bash
./demo.sh
```

---

## 📄 License
MIT © 2026 Don Carlo (`@ethusnu`) & Rascoff (Staff Engineer Specialist).
