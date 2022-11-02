import { Badge, Box, Center, Heading, Text } from "@chakra-ui/react";
import Link from "next/link";

const DemoLink = ({ href, title, text, isNew }) => (
  <Center justifySelf="center" position="relative">
    {isNew && (
      <Box position="absolute" top="-10px" right="10px" display="flex">
        <Badge shadow="sm" colorScheme="green" marginRight={2} fontSize="md">New</Badge>
        <Badge shadow="sm" colorScheme="purple" fontSize="md">Alpha</Badge>
      </Box>
    )}
    <Link href={href}>
      <a>
        <Box
          _hover={{
            bg: "gray.100",
          }}
          border="1px"
          borderColor="gray.300"
          p={4}
          borderRadius="4px"
          boxShadow="lg"
          minW="320px"
          maxW="100%"
        >
          <Heading as="h2" textAlign="center">
            {title}
          </Heading>
          <Text>{text}</Text>
        </Box>
      </a>
    </Link>
  </Center>
);

export default DemoLink;
