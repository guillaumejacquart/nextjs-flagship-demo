import {
  Box,
  Heading,
  Highlight,
  Text,
  Code as ChakraCode,
} from "@chakra-ui/react";
import { DecisionMode, Flagship, useFsFlag } from "@flagship.io/react-sdk";
import BackToHome from "../components/common/BackToHome";
import StaticBanner from "../components/common/Banners/Static";
import AsynchronousBanner from "../components/common/Banners/Asynchrounous";
import Code from "../components/common/Code";
import FlagshipContext from "../components/common/FlagshipContext";
import Loader from "../components/common/Loader";
import { API_KEY, ENV_ID } from "../config";

export default function SSG({ showBanner, isLoadingUser }) {
  const showVIPBanner = useFsFlag("showVIPBanner", false).getValue(false);
  return (
    <div>
      <main>
        <BackToHome />
        <Heading as="h1">This page is statically rendered</Heading>
        <FlagshipContext />
        {showBanner && <StaticBanner />}
        <Box my={8}>
          {isLoadingUser && <Loader text="Loading the user profile..." />}
          {!isLoadingUser && showVIPBanner && <AsynchronousBanner />}
        </Box>
      </main>
      <Code path="ssr.js" />
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
