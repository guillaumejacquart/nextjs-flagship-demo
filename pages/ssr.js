import { Flagship, useFsFlag } from "@flagship.io/react-sdk";
import { Box, Heading, Text } from "@chakra-ui/react";

import { API_KEY, ENV_ID } from "../config";
import BackToHome from "../components/common/BackToHome";
import BigButton from "../components/common/BigButton";
import Banner from "../components/common/Banner";
import Code from "../components/common/Code";
import FlagshipContext from "../components/common/FlagshipContext";
import ServerSideJSBanner from "../components/common/Banners/ServerSideJS";
import ServerSideReactBanner from "../components/common/Banners/ServerSideReact";

export default function SSR({ flags: { showBanner } }) {
  const showVIPBanner = useFsFlag("showVIPBanner", false).getValue(false);

  return (
    <div>
      <main>
        <BackToHome />
        <Heading as="h1">This page is server-side rendered</Heading>
        <FlagshipContext />
        {showBanner && <ServerSideJSBanner />}
        {showVIPBanner && <ServerSideReactBanner />}
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
