import { Contract } from "ethers";
import DemoCollectionAbi from "./DemoCollectionAbi.json";
import { getMetadata } from "../services/IPFSService";

export default class CollectionService {
  constructor(provider) {
    this.contract = new Contract(
      "0xC7c9aF125D41eDCE1754FDA781268ecE3918a159",
      DemoCollectionAbi,
      provider
    );
  }

  async getAllNFTs() {
    const data = await this.contract.getAllTokensData();

    const nfts = await Promise.all(
      data.map(async (nft) => {
        const metadata = await getMetadata(nft.uri);

        return {
          ...nft,
          ...metadata,
        };
      })
    );

    return nfts;
  }

  async getNFT(id) {
    return await this.contract.getTokenData(id);
  }

  async mint(signer, cid, price) {
    return await this.contract
      .connect(signer)
      .mint(cid, price, { value: 1n * 10n ** 16n });
  }
}
