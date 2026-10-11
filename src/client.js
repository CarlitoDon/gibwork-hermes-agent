const { GibworkClient, DEFAULT_GIBWORK_API_URL } = require("@gibwork/sdk");
const { getSigner } = require("./signer");

function getGibworkClient(options = {}) {
  const signer = options.signer || getSigner(options.keypairPath);
  const apiUrl = options.apiUrl || process.env.GIBWORK_API_URL || DEFAULT_GIBWORK_API_URL;

  const client = new GibworkClient({
    signer,
    apiUrl
  });

  return {
    client,
    signer,
    apiUrl
  };
}

module.exports = { getGibworkClient };
