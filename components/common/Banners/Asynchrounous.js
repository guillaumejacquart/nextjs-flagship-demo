import { Alert, Code, Text } from "@chakra-ui/react";
import Banner from "../Banner";

const AsynchronousBanner = () => (
  <Banner
    bg="green.50"
    tag="asynchronous"
    title="Banner for VIP users"
    text={
      <>
        This banner is{" "}
        <Text as="span" fontWeight="bold">
          asynchronously rendered
        </Text>
        . It has been{" "}
        <Text as="span" fontWeight="bold">
          dynamically created at runtime
        </Text>
        .
        <br />
        It is displayed because the{" "}
        <Code colorScheme="yellow">showVIPBanner</Code> flag is true, loaded
        using the <Code colorScheme="yellow">useFsFlag</Code> hook executed
        client-side.
        <Alert mt={4} status="warning" variant="left-accent">
          We have to wait for the visitor context to be fetched from the API
          before displaying the banner. You can show a loading state or skeleton
          to prevent flickering (You can see it when reloading the page)
        </Alert>
      </>
    }
  />
);

export default AsynchronousBanner;
