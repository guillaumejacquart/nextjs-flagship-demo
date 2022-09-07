import { Box, Center, Heading, Text } from "@chakra-ui/react";
import Link from "next/link";

const DemoLink = ({ href, title, text }) => (
  <Center justifySelf="center">
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
