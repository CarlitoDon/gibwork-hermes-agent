#!/usr/bin/env node
const { Command } = require("commander");
const { getGibworkClient } = require("./client");

const program = new Command();

program
  .name("gibwork-agent")
  .description("Autonomous AI Agent & Developer CLI for Gibwork Bounty Marketplace")
  .version("1.0.0");

program
  .command("status")
  .description("Display connected Solana agent wallet and Gibwork API configuration")
  .action(() => {
    try {
      const { signer, apiUrl } = getGibworkClient();
      console.log("\n==================================================");
      console.log("⚡️ GIBWORK AGENT STATUS");
      console.log("==================================================");
      console.log(`Agent Public Key: ${signer.publicKey.toBase58()}`);
      console.log(`API URL         : ${apiUrl}`);
      console.log(`Keypair Source  : Burner Wallet (~/.config/solana/burner_wallet.json)`);
      console.log("Status          : Ready for Autonomous Bounty Hunting\n");
    } catch (err) {
      console.error(`Error loading agent status: ${err.message}`);
      process.exit(1);
    }
  });

program
  .command("task <taskId>")
  .description("Fetch and inspect a Gibwork bounty/task by ID")
  .action(async (taskId) => {
    try {
      const { client } = getGibworkClient();
      console.log(`\nFetching task [${taskId}] from Gibwork API...`);
      const task = await client.tasks.get(taskId);
      console.log("\n==================================================");
      console.log(`📋 TASK DETAILS: ${task.title || taskId}`);
      console.log("==================================================");
      console.log(JSON.stringify(task, null, 2));
    } catch (err) {
      console.error(`Error fetching task ${taskId}: ${err.message}`);
      process.exit(1);
    }
  });

program
  .command("submissions <taskId>")
  .description("List submissions for a specific bounty task")
  .action(async (taskId) => {
    try {
      const { client } = getGibworkClient();
      console.log(`\nFetching submissions for task [${taskId}]...`);
      const submissions = await client.submissions.list(taskId);
      console.log("\n==================================================");
      console.log(`📤 SUBMISSIONS FOR TASK [${taskId}]`);
      console.log("==================================================");
      console.log(JSON.stringify(submissions, null, 2));
    } catch (err) {
      console.error(`Error fetching submissions for ${taskId}: ${err.message}`);
      process.exit(1);
    }
  });

program
  .command("submit <taskId>")
  .description("Submit work / proof to a Gibwork bounty task")
  .requiredOption("--content <content>", "Description of work done / deliverable notes")
  .option("--url <url>", "Primary artifact or proof URL (GitHub, tweet, demo, etc.)")
  .action(async (taskId, options) => {
    try {
      const { client, signer } = getGibworkClient();
      console.log(`\nSubmitting work for task [${taskId}] as ${signer.publicKey.toBase58()}...`);
      
      const payload = {
        content: options.content,
        url: options.url
      };

      const result = await client.submissions.create(taskId, payload);
      console.log("\n==================================================");
      console.log("✅ SUBMISSION SUCCESSFUL!");
      console.log("==================================================");
      console.log(JSON.stringify(result, null, 2));
    } catch (err) {
      console.error(`Error submitting work to task ${taskId}: ${err.message}`);
      process.exit(1);
    }
  });

program.parse(process.argv);
