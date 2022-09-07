import { Box, Heading, Skeleton, Stack, Text } from "@chakra-ui/react";
import { useFlagship, useFsFlag } from "@flagship.io/react-sdk";
import BackToHome from "../components/common/BackToHome";
import ClientSideReactBanner from "../components/common/Banners/ClientSideReact";
import AsynchronousBanner from "../components/common/Banners/Asynchrounous";
import Code from "../components/common/Code";
import FlagshipContext from "../components/common/FlagshipContext";
import Loader from "../components/common/Loader";
import ServerSideMiddlewareBanner from "../components/common/Banners/ServerSideMiddleware";
import ServerSideReactBanner from "../components/common/Banners/ServerSideReact";

export default function CSR({ isLoadingUser, flags: { showBanner } }) {
  const flagship = useFlagship();
  const showVIPBanner = useFsFlag("showVIPBanner", false).getValue(false);

  return (
    <div>
      <main>
        <BackToHome />
        <Heading as="h1">This page is server-side rendered</Heading>
        <Heading as="h2" fontSize="xl" mt={2}>
          With a middleware to load the flags
        </Heading>
        <FlagshipContext />
        <Box my={8}>{showBanner && <ServerSideMiddlewareBanner />}</Box>
        <Box my={8}>
          {isLoadingUser && <Loader text="Loading the user profile..." />}
          {!isLoadingUser && showVIPBanner && <AsynchronousBanner />}
        </Box>
      </main>
      <Code path="middleware.js" />
    </div>
  );
}

export async function getServerSideProps(context) {
  const showBanner = context.query.showBanner === "true";

  return {
    props: {
      flags: {
        showBanner,
      },
    }, // will be passed to the page component as props
  };
}
