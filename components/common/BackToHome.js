import { Box, Button } from "@chakra-ui/react";
import Link from "next/link";

const BackToHome = () => (
  <Box my={4}>
    <Link href="/">
      <Button variant="link">&lt; Back to home</Button>
    </Link>
  </Box>
);

export default BackToHome;
