import { Box, Heading, SimpleGrid, useDisclosure } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { useState } from "react";

import NFTCard from "./Card";
import DetailsModal from "./DetailsModel";

const Gallery = ({ nftData }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedItem, setSelectedItem] = useState({});

  function handleItemSelected(item) {
    setSelectedItem(item);
    onOpen();
  }

  if (nftData.length > 0) {
    return (
      <SimpleGrid
        alignItems="center"
        pt={100}
        px={10}
        spacing={10}
        minChildWidth={300}
      >
        {nftData.map((item) => (
          <NFTCard
            key={item.tokenId}
            tokenId={item.tokenId}
            imageURL={item.imageURL}
            onItemSelected={() => handleItemSelected(item)}
          />
        ))}
        <DetailsModal isOpen={isOpen} onClose={onClose} data={selectedItem} />
      </SimpleGrid>
    );
  } else {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        width="100%"
        height="calc(100vh)"
      >
        <CloseIcon boxSize={20} />
        <Heading mt={5}>No data available!</Heading>
      </Box>
    );
  }
};

export default Gallery;
