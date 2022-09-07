import { Badge, Box, Text } from "@chakra-ui/react";

const Banner = ({ bg = "gray.100", text, tag = "", title = "" }) => (
  <Box
    bg={bg}
    my={8}
    w="100%"
    p={4}
    color="gray.800"
    boxShadow="lg"
    border="1px"
    borderColor="gray.400"
    rounded="md"
  >
    {title && (
      <Text fontWeight="bold" fontSize="lg" mb={2}>
        {title}
        <Badge ml="1" mb="1" colorScheme="purple" fontSize="0.8em">
          {tag}
        </Badge>
      </Text>
    )}
    {text}
  </Box>
);

export default Banner;
