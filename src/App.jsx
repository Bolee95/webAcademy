import { Flex, Center, VStack, Button, Text, useToast } from "@chakra-ui/react";
import { LinkIcon } from "@chakra-ui/icons";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import { BrowserProvider } from "ethers";
import { useState, useEffect } from "react";

function App() {
  const [provider, setProvider] = useState(null);
  const [setup, setSetup] = useState({
    signer: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast({
    position: "top-right",
    isClosable: true,
    duration: 3000,
  });

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

      window.ethereum.on("disconnect", () => {
        loadAccounts();
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
        setSetup({
          signer: await provider.getSigner(),
        });
      } else {
        setSetup({});
      }
    }
  };

  const handleConnectWallet = async () => {
    setIsLoading(true);
    
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

    setIsLoading(false);
  };

  return (
    <Flex flexDirection={"column"} minH={"80vh"} justifyContent={"center"}>
      <Center flexDirection={"column"}>
        <VStack>
          <ColorModeSwitcher />
          {setup.signer && <Text>Active address: {setup.signer.address}</Text>}
          {!setup.signer && (
            <Button
              variant={"solid"}
              colorScheme={"blue"}
              size={"lg"}
              p={4}
              leftIcon={<LinkIcon />}
              isLoading={isLoading}
              onClick={handleConnectWallet}
            >
              Connect wallet
            </Button>
          )}
          {/* {data && <Counter provider={provider} />} */}
        </VStack>
      </Center>
    </Flex>
  );
}

export default App;
