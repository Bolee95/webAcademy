import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { useState } from "react";
// import CustomOverlay from "./CustomOverlay";

const CreateModal = ({ isOpen, onCreate, onClose }) => {
  const [data, setData] = useState({
    imageURL: "",
    description: "",
  });

  function handleCreateNFT(e) {
    e.preventDefault();
    onCreate(data);
    onClose();
  }
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create NFT</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleCreateNFT}>
          <ModalBody>
            <FormControl p={4} isRequired>
              <FormLabel>Description</FormLabel>
              <Input
                placeholder="Snowy day"
                onChange={(e) =>
                  setData({ ...data, description: e.currentTarget.value })
                }
              />
            </FormControl>
            <FormControl p={4} isRequired>
              <FormLabel>Image URL</FormLabel>
              <Input
                placeholder="https://unsplash.com/124"
                onChange={(e) =>
                  setData({ ...data, imageUrl: e.currentTarget.value })
                }
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button size="lg" p={3} width="full" type="submit">
              Create
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default CreateModal;
