import { Alert, CheckboxIcon, Code, Text } from "@chakra-ui/react";
import Banner from "../Banner";

const ServerSideJSBanner = () => (
  <Banner
    bg="gray.100"
    tag="server-side"
    title="Banner for all users"
    text={
      <>
        This banner is{" "}
        <Text as="span" fontWeight="bold">
          server-side rendered
        </Text>
        . It has been generated{" "}
        <Text as="span" fontWeight="bold">
          on the server at runtime
        </Text>
        .
        <br />
        It is displayed because the <Code colorScheme="yellow">
          showBanner
        </Code>{" "}
        flag is true, loaded using the JS SDK method{" "}
        <Code colorScheme="yellow">getFlag</Code> on the{" "}
        <Code colorScheme="yellow">getServerSideProps</Code> method.
        <Alert mt={4} status="success" variant="left-accent">
          You can check that the banner is present on the HTML generated source
          (Right click &amp; &quot;View page source&quot;)
        </Alert>
      </>
    }
  />
);

export default ServerSideJSBanner;
