import { AddIcon, LinkIcon } from "@chakra-ui/icons";
import {
  HStack,
  Text,
  Flex,
  Button,
  Spacer,
  VStack,
  Select,
} from "@chakra-ui/react";
import { ColorModeSwitcher } from "./ColorModeSwitcher";

import { useState } from "react";
import { ethers } from "ethers";

const Header = ({
  user,
  viewOptions,
  isConnecting,
  isConnected,
  handleConnectWallet,
  handleViewOptionSelect,
}) => {
  const [isMinting, setIsMinting] = useState(false);

  const shrinkAddress = (address) => {
    return address.substring(0, 8) + "..." + address.substring(34, 42);
  };

  const formatBalance = (balance) => {
    return ethers.formatEther(balance).substring(0, 6);
  };

  return (
    <Flex
      width="100%"
      padding={4}
      position="fixed"
      backgroundColor={"gray.600"}
      zIndex={100}
      alignItems={"center"}
    >
      <HStack spacing={5}>
        <Button
          loadingText="Minting..."
          size={{ base: "md", md: "md", lg: "lg" }}
          leftIcon={<AddIcon />}
          isDisabled={!isConnected || isMinting}
          isLoading={isMinting}
        >
          Create NFT
        </Button>
        <Select colorScheme="blue" onChange={handleViewOptionSelect}>
          {viewOptions.map((option) => (
            <option value={option} key={option}>
              {option}
            </option>
          ))}
        </Select>
      </HStack>
      <Spacer />
      <VStack p={0} alignItems={"start"}>
        <Text fontSize="medium" textColor="white">
          {user.signer ? `${shrinkAddress(user.signer.address)}` : ""}
        </Text>
        <Text fontSize="medium" textColor="white">
          Balance: {formatBalance(user.balance)} ETH
        </Text>
      </VStack>
      <ColorModeSwitcher />
      <Button
        loadingText="Loading..."
        size={{ base: "md", md: "md", lg: "lg" }}
        leftIcon={<LinkIcon />}
        isLoading={isConnecting}
        isDisabled={isConnected}
        onClick={handleConnectWallet}
      >
        {isConnected ? "Connected" : "Connect"}
      </Button>
    </Flex>
  );
};

export default Header;
