import { Button, Container, Text, VStack, useToast } from "@chakra-ui/react";
import { useEffect } from "react";
import { Contract } from "ethers";

import { useState } from "react";

import counterABI from "./CounterAbi.json";

export default function Counter({ provider }) {
  const [counter, setCounter] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [counterContract, setCounterContract] = useState(null);
  const toast = useToast({
    position: "top-right",
    isClosable: true,
    duration: 3000,
  });

  useEffect(() => {
    const setupContract = async () => {
      const contract = new Contract(
        "0xBe27b255e6fa3cb7a422ED2575522C24743c4572",
        counterABI,
        await provider.getSigner()
      );

      const getCounterValue = async () => {
        const count = (await contract.getCounterValue()).toString();
        console.log(count);
        setCounter(count);
      };

      setCounterContract(contract);
      getCounterValue();

      contract.on("CounterIncreased", getCounterValue);
      contract.on("CounterDecreased", getCounterValue);
    };

    setupContract();
  }, [provider]);

  useEffect(() => {
    return () => {
      counterContract?.removeAllListeners();
    };
  }, [counterContract]);

  const handleInclement = async () => {
    setIsProcessing(true);

    try {
      await counterContract.inclement();
      toast({ title: "Counter increased", status: "success" });
    } catch (error) {
      toast({
        title: "Counter increase failed",
        status: "error",
        description: error.message,
      });
    }

    setIsProcessing(false);
  };

  const handleDeclement = async () => {
    setIsProcessing(true);

    try {
      await counterContract.declement();
      toast({ title: "Counter decreased", status: "success" });
    } catch (error) {
      toast({
        title: "Counter decrease failed",
        status: "error",
        description: error.message,
      });
    }

    setIsProcessing(false);
  };

  return (
    <Container borderColor="teal.100" borderWidth={2} borderRadius={5} p={10}>
      <VStack gap={5}>
        <Text fontSize="2xl">Current counter value is {counter}</Text>
        <Button
          variant={"solid"}
          colorScheme={"blue"}
          size={"lg"}
          onClick={handleInclement}
          isLoading={isProcessing}
        >
          Inclement
        </Button>
        <Button
          variant={"solid"}
          colorScheme={"blue"}
          size={"lg"}
          onClick={handleDeclement}
          isLoading={isProcessing}
        >
          Declement
        </Button>
      </VStack>
    </Container>
  );
}
