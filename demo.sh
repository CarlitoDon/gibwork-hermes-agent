#!/usr/bin/env bash
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"

echo "=================================================="
echo "🚀 RUNNING GIBWORK AGENT MCP & CLI SUITE DEMO"
echo "=================================================="

echo -e "\n[STEP 1] Testing Agent CLI Status..."
node src/cli.js status

echo -e "\n[STEP 2] Testing MCP Server Handshake (initialize)..."
INIT_RES=$(echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}' | node src/mcp-server.js)
echo "$INIT_RES"

echo -e "\n[STEP 3] Testing MCP Tools List (tools/list)..."
TOOLS_RES=$(echo '{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}' | node src/mcp-server.js)
echo "$TOOLS_RES"

echo -e "\n[STEP 4] Testing MCP Tool Call (gibwork_agent_status)..."
CALL_RES=$(echo '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"gibwork_agent_status","arguments":{}}}' | node src/mcp-server.js)
echo "$CALL_RES"

echo -e "\n=================================================="
echo "✅ ALL GIBWORK AGENT CHECKS PASSED SUCCESSFULLY!"
echo "=================================================="
