import {
  Text,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  Image,
  VStack,
  Heading,
  AspectRatio,
  ModalOverlay,
} from "@chakra-ui/react";
// import CustomOverlay from "./CustomOverlay";

const DetailsModal = ({ isOpen, onClose, data }) => {
  return (
    <Modal
      size="2xl"
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      motionPreset="scale"
    >
      {/* <CustomOverlay /> */}
      <ModalOverlay />
      <ModalContent>
        <ModalHeader />
        <ModalCloseButton />
        <AspectRatio>
          <Image
            maxH={500}
            src={data.imageURL}
            p={5}
            borderRadius="3xl"
          ></Image>
        </AspectRatio>
        <VStack mb={10} gap={2}>
          <Heading size="lg">NFT ID {data.tokenId}</Heading>
          <Text fontSize="lg">Owner: {data.owner}</Text>
          <Text fontSize="lg">Description: {data.description}</Text>
        </VStack>
      </ModalContent>
    </Modal>
  );
};

export default DetailsModal;
