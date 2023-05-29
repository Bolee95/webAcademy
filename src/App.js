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
    setIsMinting(true);

    const metadata = {
      description: data.description,
      image: data.imageUrl,
    };

    await uploadJSON(Date.now().toString(), metadata, (cid) => {
      console.log(collectionService);
      if (collectionService) {
        console.log(cid);

        console.log(collectionService);

        collectionService.mint(user.signer, cid, data.price).then((tx) => {
          toast({
            title: "Create NFT transaction send",
            status: "success",
            description: tx.hash,
          });

          setIsMinting(false);

          provider.once(tx.hash, () => {
            toast({
              title: "New NFT Created!",
              status: "success",
            });

            // FIXME Refresh the list of nfts because maybe somenone also create a new NFT
          });
        });
      }
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
