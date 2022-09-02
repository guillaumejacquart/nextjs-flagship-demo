import { Flagship, useFsFlag } from "@flagship.io/react-sdk";
import { Box, Heading, Text } from "@chakra-ui/react";

import { API_KEY, ENV_ID } from "../config";
import BigButton from "../components/common/BigButton";
import Banner from "../components/common/Banner";
import Loader from "../components/common/Loader";
import Code from "../components/common/Code";

export default function SSR({ showBanner, isLoadingUser }) {
  const displayBigButton = useFsFlag("displayBigButton", false).getValue(false);
  const showVIPBanner = useFsFlag("showVIPBanner", false).getValue(false);

  return (
    <div>
      <main>
        <Heading as="h1">This page is server-side rendered</Heading>
        <Box my={8}>
          {showBanner && (
            <Banner
              text={
                <>
                  This banner is server-side rendered.
                  <br />
                  It is displayed because the `showBanner` flag is true, loaded
                  using the JS SDK on the `getServerSideProps` method
                </>
              }
            />
          )}
        </Box>
        <Box my={8}>
          {isLoadingUser && <Loader text="Loading user..." />}
          {showVIPBanner && (
            <Banner
              bg="green"
              text={
                <>
                  This VIP banner is asynchronously loaded.
                  <br />
                  It is displayed because the `showVIPBanner` flag is true,
                  loaded using the `useFsFlag` hook executed client-side
                </>
              }
            />
          )}
        </Box>
        <Box my={8}>
          <Text>
            This button is shown according to Flagship
            &quot;displayBigButton&quot; flag, loaded using the `useFsFlag` hook
            executed during the server-side rendering
          </Text>
          {displayBigButton && <BigButton />}
          {!displayBigButton && <div>No button</div>}
        </Box>
      </main>
      <Code path="ssr.js" />
    </div>
  );
}

export async function getServerSideProps(context) {
  //Start the Flagship SDK
  const flagship = Flagship.start(ENV_ID, API_KEY, {
    fetchNow: false,
  });

  const initialVisitorData = {
    id: "my_visitor_id",
    context: {
      any: "value",
    },
  };

  // Create a new visitor
  const visitor = flagship?.newVisitor({
    visitorId: initialVisitorData.id,
    context: initialVisitorData.context,
  });

  //Fetch flags
  await visitor?.fetchFlags();
  const showBanner = visitor.getFlag("showBanner", false).getValue(false);

  return {
    props: {
      initialFlagsData: visitor?.getFlagsDataArray(),
      initialVisitorData,
      showBanner,
    }, // will be passed to the page component as props
  };
}
