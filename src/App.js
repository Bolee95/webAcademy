import { Box, useToast } from "@chakra-ui/react";
import { BrowserProvider } from "ethers";
import { useState, useEffect } from "react";

import Header from "./Header";
import Gallery from "./Gallery";

import { uploadJSON } from "./services/IPFSService";
import DemoData from "./demo/DemoNFTData.json";

const App = () => {
  const [provider, setProvider] = useState(null);
  const [nftData, setNftData] = useState([]);
  const [user, setUser] = useState({
    signer: null,
    balance: 0,
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMinting, setIsMinting] = useState(false);

  const toast = useToast({
    position: "bottom-right",
    isClosable: true,
    duration: 3000,
  });

  const viewOptions = ["All", "My NFTs", "Offered", "My offers"];

  useEffect(() => {
    const setupProvider = async () => {
      if (window.ethereum) {
        const provider = new BrowserProvider(window.ethereum);
        setProvider(provider);
      }
    };

    setupProvider();
  }, []);

  useEffect(() => {
    if (provider) {
      loadAccounts();

      window.ethereum.on("accountsChanged", (accounts) => {
        updateAccounts(accounts);
      });

      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });

      return () => {
        window.ethereum?.removeAllListeners();
      };
    }
  }, [provider]);

  useEffect(() => {
    loadNftData();
  }, []);

  const loadAccounts = async () => {
    const accounts = await provider.send("eth_accounts", []);
    updateAccounts(accounts);
  };

  const updateAccounts = async (accounts) => {
    if (provider) {
      if (accounts && accounts.length > 0) {
        setUser({
          signer: await provider.getSigner(),
          balance: await provider.getBalance(accounts[0]),
        });
      } else {
        setUser({ signer: null, balance: 0 });
      }
    }
  };

  const loadNftData = async () => {
    // contractWrapper.getTokenCount()
    // .then((count) => {
    //   // Form array of token IDs
    //   const tokenIDs = Array.from({length: count}, (_, index) => index + 1);
    //   // Form array of req for token details
    //   const tokenDetailsRequests = tokenIDs.map((tokenID) => contractWrapper.getTokenDetails(tokenID));
    //   Promise.all(tokenDetailsRequests)
    //   .then((tokenDetails) => {
    //     // Form array of req for token metadata
    //     const metadataURLRequests = tokenDetails.map((detail) => getMetadata(detail.uri));
    //     Promise.all(metadataURLRequests)
    //     .then((metadata) => {
    //       formNFTData(tokenIDs, tokenDetails, metadata);
    //     });
    //   });
  };

  const formNFTData = (tokenIDs, tokenDetails, metadata) => {
    const newNFTData = [];

    tokenIDs.forEach((tokenID, index) => {
      const item = {
        tokenId: tokenID,
        owner: tokenDetails[index].owner,
        imageURL: metadata[index].image,
        description: metadata[index].description,
      };

      newNFTData.push(item);
    });

    setNftData(newNFTData);
  };

  const handleConnectWallet = async () => {
    setIsConnecting(true);

    try {
      const accounts = await provider.send("eth_requestAccounts", []);
      toast({ title: "Wallet connected", status: "success" });
      updateAccounts(accounts);
    } catch (error) {
      toast({
        title: "Wallet connection failed",
        status: "error",
        description: error.code,
      });
    }

    setIsConnecting(false);
  };

  const handleViewOptionSelect = (event) => {
    console.log(event.target.value);
  };

  const handleOnCreateNFT = async ({ description, imageUrl }) => {
    setIsMinting(true);

    const metadataJSON = {
      description: description,
      image: imageUrl,
    };

    const fileName =
      user.signer.address + "-" + Math.round(new Date().getTime() / 1000);

    uploadJSON(fileName, metadataJSON, (cid) => {
      contractWrapper.mint(
        cid,
        (message, isMinted) => {
          toast({ title: message });
          setIsMinting(!isMinted);

          // if (isMinted) {
          //   loadNftData();
          // }
        },
        (errorMsg) => {
          toast({ title: errorMsg });
        }
      );
    });
  };

  const headerData = {
    user: user,
    isMinting: isMinting,
    viewOptions: viewOptions,
    isConnecting: isConnecting,
    isConnected: user.signer !== null,
    handleViewOptionSelect: handleViewOptionSelect,
    handleConnectWallet: handleConnectWallet,
    onCreateNFT: handleOnCreateNFT,
  };

  return (
    <Box>
      <Header headerData={headerData} />
      <Gallery nftData={DemoData} />
    </Box>
  );
};

export default App;
