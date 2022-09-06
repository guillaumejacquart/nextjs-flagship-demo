import { Box, Text } from "@chakra-ui/react";

const FetchModeDefinition = ({ name, description, value }) => (
  <Box
    flex="1"
    bg="gray.50"
    p={3}
    border="1px"
    borderColor="blackAlpha.300"
    borderRadius={8}
  >
    <Text fontWeight="bold" mb={2}>
      {name}
    </Text>
    <Text>{description}</Text>
  </Box>
);

export default FetchModeDefinition;
