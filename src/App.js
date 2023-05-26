import { Flex, Center, VStack, Button, Text, useToast } from "@chakra-ui/react";
import { LinkIcon } from "@chakra-ui/icons";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import { BrowserProvider } from "ethers";
import { useState, useEffect } from "react";

import Counter from "./Counter";

function App() {
  const [provider, setProvider] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [account, setAccount] = useState(null);

  const toast = useToast({
    position: "top-right",
    isClosable: true,
    duration: 3000,
  });

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts && accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
        }
      });

      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });

      setProvider(new BrowserProvider(window.ethereum));

      return () => {
        window.ethereum?.removeAllListeners();
      };
    }
  }, []);

  const handleConnectWallet = async () => {
    setIsLoading(true);

    try {
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
      toast({ title: "Wallet connected", status: "success" });
    } catch (error) {
      toast({
        title: "Wallet connection failed",
        status: "error",
        description: error.message,
      });
    }

    setIsLoading(false);
  };

  return (
    <Flex flexDirection={"column"} minH={"80vh"} justifyContent={"center"}>
      <Center flexDirection={"column"}>
        <VStack>
          <ColorModeSwitcher />
          {account && <Text>Active address: {account}</Text>}
          {!account && (
            <Button
              variant={"solid"}
              background={"teal"}
              size={"lg"}
              p={4}
              leftIcon={<LinkIcon />}
              isLoading={isLoading}
              onClick={handleConnectWallet}
            >
              Connect wallet
            </Button>
          )}
          {account && <Counter provider={provider} />}
        </VStack>
      </Center>
    </Flex>
  );
}

export default App;
