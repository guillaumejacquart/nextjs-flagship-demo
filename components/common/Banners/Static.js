import { Alert, Code, Text } from "@chakra-ui/react";
import Banner from "../Banner";

const StaticBanner = () => (
  <Banner
    tag="static"
    title="Banner for all users"
    text={
      <>
        This banner is{" "}
        <Text as="span" fontWeight="bold">
          statically rendered
        </Text>
        . It has been generated during the{" "}
        <Text as="span" fontWeight="bold">
          build of the page.
        </Text>
        <br />
        It is displayed because the <Code colorScheme="yellow">
          showBanner
        </Code>{" "}
        flag is true, loaded using the JS SDK on the{" "}
        <Code colorScheme="yellow">getStaticProps</Code> method.
        <Alert mt={4} status="success" variant="left-accent">
          You can check that the banner is present on the HTML generated source
          (Right click &amp; &quot;View page source&quot;)
        </Alert>
      </>
    }
  />
);

export default StaticBanner;
