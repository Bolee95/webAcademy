import {
  Button,
  Flex,
  HStack,
  Select,
  Spacer,
  VStack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

import { ColorModeSwitcher } from "./ColorModeSwitcher";
import { AddIcon, LinkIcon } from "@chakra-ui/icons";
import { ethers } from "ethers";

import CreateModal from "./CreateModal";

const Header = ({
  user,
  isConnecting,
  isMinting,
  viewOptions,
  handleViewOptionSelect,
  handleConnect,
  handleCreateNFT,
}) => {
  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onClose: onCloseCreate,
  } = useDisclosure();

  const formattedBalance = ethers.formatEther(user.balance).substring(0, 6);
  const address = user.signer?.address;
  const formattedAddress =
    address &&
    address.substring(0, 8) +
      "..." +
      address.substring(address.length - 6, address.length);
  const isDisabled = user.signer;

  const handleCreateClick = () => {
    onCreateOpen();
  };

  return (
    <Flex
      w={"100%"}
      padding={4}
      position={"fixed"}
      backgroundColor={"gray.600"}
      zIndex={100}
      alignItems={"center"}
    >
      <HStack spacing={6}>
        <Button
          minW={"150px"}
          leftIcon={<AddIcon />}
          onClick={handleCreateClick}
          isDisabled={isMinting || !user.signer}
          isLoading={isMinting}
          loadingText={"Minting..."}
        >
          Create NFT
        </Button>
        <Select
          minW={"120px"}
          colorScheme={"whiteAlpha"}
          onChange={handleViewOptionSelect}
        >
          {viewOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
      </HStack>
      <Spacer />
      <VStack alignItems={"start"}>
        {user.signer && (
          <Text fontSize={"md"} textColor={"white"}>
            {formattedAddress}
          </Text>
        )}
        {user.signer && (
          <Text fontSize={"md"} textColor={"white"}>
            {formattedBalance} ETH
          </Text>
        )}
      </VStack>
      <ColorModeSwitcher />
      <Button
        marginLeft={"2"}
        size={{ base: "md", md: "lg", lg: "lg" }}
        leftIcon={<LinkIcon />}
        onClick={handleConnect}
        isLoading={isConnecting}
        isDisabled={isDisabled}
      >
        {isDisabled ? "Connected" : "Connect"}
      </Button>
      <CreateModal
        isOpen={isCreateOpen}
        onClose={onCloseCreate}
        onCreate={handleCreateNFT}
      ></CreateModal>
    </Flex>
  );
};

export default Header;
