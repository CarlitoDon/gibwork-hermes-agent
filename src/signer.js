const { Keypair } = require("@solana/web3.js");
const nacl = require("tweetnacl");
const fs = require("fs");
const path = require("path");
const os = require("os");

const DEFAULT_KEYPAIR_PATH = path.join(os.homedir(), ".config/solana/burner_wallet.json");

function getSigner(keypairPath = DEFAULT_KEYPAIR_PATH) {
  if (!fs.existsSync(keypairPath)) {
    throw new Error(`Solana keypair file not found at ${keypairPath}`);
  }
  const raw = JSON.parse(fs.readFileSync(keypairPath, "utf8"));
  const keypair = Keypair.fromSecretKey(Uint8Array.from(raw));

  return {
    keypair,
    publicKey: keypair.publicKey,
    signMessage: async (message) => {
      return nacl.sign.detached(message, keypair.secretKey);
    },
    signTransaction: async (tx) => {
      if (typeof tx.partialSign === "function") {
        tx.partialSign(keypair);
      }
      return tx;
    }
  };
}

module.exports = { getSigner, DEFAULT_KEYPAIR_PATH };
