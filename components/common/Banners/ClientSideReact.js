import { Alert, Code, Text } from "@chakra-ui/react";
import Banner from "../Banner";

const ClientSideReact = () => (
  <Banner
    tag="asynchronous"
    title="Banner for all users"
    text={
      <>
        This banner is{" "}
        <Text as="span" fontWeight="bold">
          rendered on the client
        </Text>
        . It has been{" "}
        <Text as="span" fontWeight="bold">
          dynamically generated at runtime
        </Text>{" "}
        after the loading of the Flagship SDK.
        <br />
        It is displayed because the <Code colorScheme="yellow">
          showBanner
        </Code>{" "}
        flag is true, loaded using the{" "}
        <Code colorScheme="yellow">useFsFlag</Code> hook executed client-side.
        <Alert mt={4} status="warning" variant="left-accent">
          We have to wait for Flagship to be ready before displaying the banner.
          You can show a loading state or skeleton to prevent flickering (You
          can see it when reloading the page)
        </Alert>
      </>
    }
  />
);

export default ClientSideReact;
