import { Box, Code, Text } from "@chakra-ui/react";

const FlagDefinition = ({ name, targeting, value, defaultValue }) => (
  <Box
    flex="1"
    bg="gray.50"
    p={3}
    border="1px"
    borderColor="blackAlpha.300"
    borderRadius={8}
  >
    <Text>
      <Text as="span" fontWeight="bold">
        Name:
      </Text>{" "}
      <Code colorScheme="gray">{name}</Code>
    </Text>
    <Text>
      <Text as="span" fontWeight="bold">
        Targeting:
      </Text>{" "}
      <Code colorScheme="yellow">{targeting}</Code>
    </Text>
    <Text>
      <Text as="span" fontWeight="bold">
        Value:
      </Text>{" "}
      <Code colorScheme="teal">{value}</Code>
    </Text>
    <Text>
      <Text as="span" fontWeight="bold">
        Default value:
      </Text>{" "}
      <Code colorScheme="blackAlpha">{defaultValue}</Code>
    </Text>
  </Box>
);

export default FlagDefinition;
