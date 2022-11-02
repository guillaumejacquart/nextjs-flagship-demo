import { Button } from "@chakra-ui/react";
import Image from "next/image";

import githubLogo from "../../public/github.svg";

const SourceCode = () => (
  <Button
    as="a"
    size={{ base: "xs", md: "sm" }}
    href="https://github.com/guillaumejacquart/nextjs-flagship-demo"
    target="_blank"
    rel="noreferrer"
    leftIcon={<Image src={githubLogo} alt="Next.js" />}
    colorScheme="gray"
    variant="outline"
  >
    Source code
  </Button>
);

export default SourceCode;
