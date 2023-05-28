const { ethers } = require("ethers");
const abi = require("./AkademijaNFT.json");

export default class CollectionService {
  constructor(provider) {
    this.contract = new ethers.Contract(
      "0x400A128e52aa79a67F7e8b39116Dfd292Ca059A9",
      abi,
      provider
    );
  }

  async getTokenCount() {
    return (await this.contract.tokenCount()).toNumber();
  }

  async getTokenDetails(tokenId) {
    return await this.contract.getTokenDetails(tokenId);
  }

  async mint(signer, cid, onError) {
    try {
      const trxResponse = await this.contract.connect(signer).mint(cid);
      this.contract.provider.once(trxResponse.hash, () => {
        return this.getTokenCount();
      });
    } catch (error) {
      onError(error.message);
    }
  }
}
