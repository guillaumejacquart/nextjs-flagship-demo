import { Center, Flex, Spinner, Text } from "@chakra-ui/react";

const Loader = ({ text = "Loading..." }) => (
  <Flex>
    <Center mr={4}>
      <Text>{text}</Text>
    </Center>
    <Center>
      <Spinner />
    </Center>
  </Flex>
);

export default Loader;
