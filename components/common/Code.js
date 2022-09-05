import { Box, Button, Collapse, useDisclosure } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";

const Code = ({ path }) => {
  const [code, setCode] = useState("");
  const { isOpen, onToggle } = useDisclosure();

  useEffect(() => {
    fetch(`/pages/${path}`)
      .then((r) => r.text())
      .then(setCode);
  }, [path]);

  return (
    <>
      <Button onClick={onToggle}>{isOpen ? "Hide code" : "Show code"}</Button>
      <Collapse in={isOpen} animateOpacity>
        <Box mt="4" rounded="md" shadow="md">
          <SyntaxHighlighter language="jsx" style={tomorrow}>
            {code}
          </SyntaxHighlighter>
        </Box>
      </Collapse>
    </>
  );
};

export default Code;
