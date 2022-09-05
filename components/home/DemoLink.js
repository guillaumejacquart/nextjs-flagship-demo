import { Box, Center, Heading, Text } from "@chakra-ui/react";
import Link from "next/link";

const DemoLink = ({ href, title, text }) => (
  <Center w={400} h={300}>
    <Link href={href}>
      <a>
        <Box
          _hover={{
            bg: "gray.100",
          }}
          border="1px"
          borderColor="darkgray"
          p={4}
          borderRadius="4px"
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
