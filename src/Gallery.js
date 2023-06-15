import { useEffect, useState } from "react";
import {
  Box,
  Image,
  Badge,
  Text,
  Stack,
  Button,
  HStack,
  Heading,
  SimpleGrid,
  Spacer,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Link,
} from "@chakra-ui/react";
import { formatEther } from "ethers";

const Gallery = ({ list: unfilteredList, refreshGallery, view }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [list, setList] = useState([]);

  useEffect(() => {
    if (view === "All NFTs") {
      setList(unfilteredList);
    } else if (view === "My NFTs") {
      setList(
        unfilteredList.filter(
          (nft) =>
            nft[2].toLowerCase() ===
            window.ethereum.selectedAddress.toLowerCase()
        )
      );
    } else if (view === "Offered NFTs") {
      setList(unfilteredList);
    } else if (view === "My Offers") setList(unfilteredList);
  }, [list, view]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          {selectedNFT && (
            <>
              <ModalHeader>
                <HStack spacing={3}>
                  <Badge borderRadius="full" px="2">
                    #{selectedNFT[0].toString()}
                  </Badge>
                  <Box
                    mt="1"
                    fontWeight="semibold"
                    as="h4"
                    lineHeight="tight"
                    noOfLines={1}
                  >
                    {selectedNFT.description}
                  </Box>
                </HStack>
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Image src={selectedNFT.image} alt={selectedNFT.image} />
                <Box mt={1}>
                  Price: {formatEther(selectedNFT[1])} sepoliaETH
                </Box>
                <Box mt={1}>
                  Owner:{" "}
                  <Link
                    target="_blank"
                    href={`https://sepolia.etherscan.io/address/${selectedNFT[2]}`}
                  >
                    {selectedNFT[2]}
                  </Link>
                </Box>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={onClose}>
                  Close
                </Button>
                <Button variant="ghost">Secondary Action</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <div
        style={{
          paddingTop: "100px",
        }}
      >
        <Flex pr="5">
          <Heading as="h1" size="xl" ml={2}>
            Gallery
          </Heading>
          <Spacer />
          <Button onClick={refreshGallery} colorScheme="blue" size="sm">
            Refresh
          </Button>
        </Flex>
        <SimpleGrid columns={3} spacing={10} mt={7} ml={5}>
          {list.map((nft) => (
            <Box
              maxW="sm"
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
            >
              <Image src={nft.image} alt={nft.image} />
              <Box p="6">
                <HStack spacing={3}>
                  <Badge borderRadius="full" px="2">
                    #{nft[0].toString()}
                  </Badge>
                  <Box
                    mt="1"
                    fontWeight="semibold"
                    as="h4"
                    lineHeight="tight"
                    noOfLines={1}
                  >
                    {nft.description}
                  </Box>
                </HStack>
                <Box>{formatEther(nft[1])} sepoliaETH</Box>
                <Box>
                  <Button
                    colorScheme="gray"
                    size="sm"
                    mt={1}
                    onClick={() => {
                      setSelectedNFT(nft);
                      onOpen();
                    }}
                  >
                    See details
                  </Button>
                </Box>
              </Box>
            </Box>
          ))}
        </SimpleGrid>
      </div>
    </>
  );
};

export default Gallery;
