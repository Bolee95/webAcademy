import { BrowserProvider } from "ethers";
import { useState, useEffect } from "react";

import { useToast } from "@chakra-ui/react";

import Header from "./Header";
import CollectionService from "./collection/CollectionService";
import { uploadJSON } from "./services/IPFSService";

const App = () => {
  const [provider, setProvider] = useState(null);
  const [collectionService, setCollectionService] = useState(null);
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

  const viewOptions = ["All NFTs", "My NFTs", "Offered NFTs", "My Offers"];

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
      setCollectionService(new CollectionService(provider));

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

  const handleCreateNFT = async (data) => {
    if (!collectionService) {
      toast({ title: "No collection service" });
      return;
    }

    setIsMinting(true);

    const metadata = {
      description: data.description,
      image: data.imageUrl,
    };

    const cid = await uploadJSON(Date.now().toString(), metadata).catch(
      (error) => {
        toast({
          title: "Error while uploading metadata",
          status: "error",
          description: error.code,
        });
      }
    );

    const { hash: txHash } = await collectionService
      .mint(user.signer, cid, data.price)
      .catch((error) => {
        toast({
          title: "Error while executing `mint` transaction",
          status: "error",
          description: error.description,
        });
      });

    toast({
      title: "Create NFT transaction send",
      status: "success",
      description: txHash,
    });

    setIsMinting(false);

    provider.once(txHash, () => {
      toast({
        title: "New NFT Created!",
        status: "success",
      });
    });
  };

  return (
    <>
      <Header
        user={user}
        isConnecting={isConnecting}
        isMinting={isMinting}
        viewOptions={viewOptions}
        handleViewOptionSelect={(e) => {
          console.log(e.target.value);
        }}
        handleConnect={handleConnectWallet}
        handleCreateNFT={handleCreateNFT}
      />
    </>
  );
};

export default App;
