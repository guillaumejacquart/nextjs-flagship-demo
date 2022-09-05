import { Flagship, useFsFlag } from "@flagship.io/react-sdk";
import { Box, Heading, Text } from "@chakra-ui/react";

import { API_KEY, ENV_ID } from "../config";
import BackToHome from "../components/common/BackToHome";
import BigButton from "../components/common/BigButton";
import Banner from "../components/common/Banner";
import Code from "../components/common/Code";
import FlagshipContext from "../components/common/FlagshipContext";

export default function SSR({ flags: { showBanner } }) {
  const displayBigButton = useFsFlag("displayBigButton", false).getValue(false);
  const showVIPBanner = useFsFlag("showVIPBanner", false).getValue(false);

  return (
    <div>
      <main>
        <BackToHome />
        <Heading as="h1">This page is server-side rendered</Heading>
        <FlagshipContext />
        <Box my={8}>
          {showBanner && (
            <Banner
              text={
                <>
                  This banner is server-side rendered.
                  <br />
                  It is displayed because the `showBanner` flag is true, loaded
                  using the JS SDK on the `getServerSideProps` method
                  <br />
                  You can check that the banner is present on the HTML generated
                  source (Right click &amp; &quot;View page source&quot;)
                </>
              }
            />
          )}
        </Box>
        <Box my={8}>
          {showVIPBanner && (
            <Banner
              bg="green"
              text={
                <>
                  This VIP banner is loaded server-side.
                  <br />
                  It is displayed because the `showVIPBanner` flag is true,
                  loaded using the `useFsFlag` hook executed during the
                  server-side rendering
                </>
              }
            />
          )}
        </Box>
      </main>
      <Code path="ssr.js" />
    </div>
  );
}

export async function getServerSideProps(context) {
  // Simulate a call to the database or API to get the user info
  const user = await new Promise((resolve) => {
    setTimeout(() => resolve({ isVip: true }), 500);
  });

  //Start the Flagship SDK
  const flagship = Flagship.start(ENV_ID, API_KEY, {
    fetchNow: false,
  });

  // Initialize visitor data from user info
  const initialVisitorData = {
    id: "my_visitor_id",
    context: {
      isVip: user.isVip,
    },
  };

  // Create a new visitor
  const visitor = flagship?.newVisitor({
    visitorId: initialVisitorData.id,
    context: initialVisitorData.context,
  });

  // Fetch flags
  await visitor?.fetchFlags();
  const showBanner = visitor.getFlag("showBanner", false).getValue(false);

  console.log(visitor?.getFlagsDataArray());
  return {
    props: {
      initialFlagsData: visitor?.getFlagsDataArray(),
      initialVisitorData,
      flags: {
        showBanner,
      },
    }, // will be passed to the page component as props
  };
}
