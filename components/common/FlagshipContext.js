import { Box, Heading, Text } from "@chakra-ui/react";
import { useFlagship } from "@flagship.io/react-sdk";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";

const FlagshipContext = () => {
  const flagship = useFlagship();

  return (
    <Box mt="4" rounded="md" shadow="md">
      <Text>Current Flagship visitor context:</Text>
      <SyntaxHighlighter language="jsx" style={tomorrow}>
        {JSON.stringify(
          Object.fromEntries(
            Object.entries(flagship.context).filter(([k]) => !k.includes("fs_"))
          ),
          null,
          4
        )}
      </SyntaxHighlighter>
    </Box>
  );
};

export default FlagshipContext;
