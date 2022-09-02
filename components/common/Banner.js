import { Box } from "@chakra-ui/react";

const Banner = ({ bg = "red", text }) => (
  <Box bg={bg} w="100%" p={4} color="white">
    {text}
  </Box>
);

export default Banner;
