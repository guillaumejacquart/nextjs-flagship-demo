import { Box, Heading, Text } from "@chakra-ui/react";
import { DecisionMode, Flagship, useFsFlag } from "@flagship.io/react-sdk";
import Banner from "../components/common/Banner";
import BigButton from "../components/common/BigButton";
import Loader from "../components/common/Loader";
import { API_KEY, ENV_ID } from "../config";

export default function SSG({ showBanner, isLoadingUser }) {
  const displayBigButton = useFsFlag("displayBigButton", false).getValue(false);
  const showVIPBanner = useFsFlag("showVIPBanner", false).getValue(false);
  return (
    <div>
      <main>
        <Heading as="h1">This page is statically rendered</Heading>
        <Box my={8}>
          {showBanner && (
            <Banner
              text={
                <>
                  This banner is statically rendered.
                  <br />
                  It is displayed because the `showBanner` flag is true, loaded
                  using the `useFsFlag` hook executed client-side
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
                  loaded using the JS SDK on the `getStaticProps` method
                </>
              }
            />
          )}
        </Box>
        <Box my={8}>
          <Text>
            This button is shown according to Flagship
            &quot;displayBigButton&quot; flag, loaded using the `useFsFlag` hook
            executed during the build time
          </Text>
          {displayBigButton && <BigButton />}
          {!displayBigButton && <div>No button</div>}
        </Box>
      </main>
    </div>
  );
}

export async function getStaticProps(context) {
  const bucketingFileData = await fetch(
    `https://cdn.flagship.io/${ENV_ID}/bucketing.json`
  ).then((r) => r.json());

  //Start the Flagship SDK
  const flagship = Flagship.start(ENV_ID, API_KEY, {
    fetchNow: false,
    decisionMode: DecisionMode.BUCKETING,
    initialBucketing: bucketingFileData,
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
    // Passed to the page component as props
    props: {
      showBanner,
      initialBucketing: bucketingFileData,
      decisionMode: "bucketing",
    },
  };
}
