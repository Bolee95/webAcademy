import {
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalOverlay,
  FormControl,
  FormLabel,
  Input,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import { useState } from "react";
import { parseEther } from "ethers";

const CreateModal = ({ isOpen, onCreate, onClose }) => {
  const [formData, setFormData] = useState({
    description: "",
    imageUrl: "",
    price: 0,
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    onCreate(formData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered={true}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create new NFT</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <FormControl p={4} isRequired>
              <FormLabel>Description</FormLabel>
              <Input
                placeholder="Sunny day"
                onChange={(e) => {
                  setFormData({ ...formData, description: e.target.value });
                }}
              />
            </FormControl>
            <FormControl p={4} isRequired>
              <FormLabel>Image URL</FormLabel>
              <Input
                placeholder="https://unsplash.com"
                onChange={(e) => {
                  setFormData({ ...formData, imageUrl: e.target.value });
                }}
              />
            </FormControl>
            <FormControl p={4} isRequired>
              <FormLabel>Desired price</FormLabel>
              <Input
                type="number"
                placeholder="0.01 ETH"
                onChange={(e) => {
                  try {
                    const price = parseEther(e.target.value);

                    setFormData({ ...formData, price });
                  } catch (e) {
                    console.error(e);
                  }
                }}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button size={"lg"} width={"full"} type="submit">
              Create NFT
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default CreateModal;
