import { Alert, Code, Text } from "@chakra-ui/react";
import Banner from "../Banner";

const ServerSideReactBanner = () => (
  <Banner
    bg="green.50"
    tag="server-side"
    title="Banner for VIP users"
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
        It is displayed because the{" "}
        <Code colorScheme="yellow">showVIPBanner</Code> flag is true, loaded
        using the <Code colorScheme="yellow">useFsFlag</Code> hook executed
        during the server-side rendering of the page.
        <br />
        <Alert mt={4} status="success" variant="left-accent">
          You can check that the banner is present on the HTML generated source
          (Right click &amp; &quot;View page source&quot;)
        </Alert>
      </>
    }
  />
);

export default ServerSideReactBanner;
