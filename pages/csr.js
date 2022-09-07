import { Box, Heading, Skeleton, Stack, Text } from "@chakra-ui/react";
import { useFlagship, useFsFlag } from "@flagship.io/react-sdk";
import BackToHome from "../components/common/BackToHome";
import ClientSideReactBanner from "../components/common/Banners/ClientSideReact";
import AsynchronousBanner from "../components/common/Banners/Asynchrounous";
import Code from "../components/common/Code";
import FlagshipContext from "../components/common/FlagshipContext";
import Loader from "../components/common/Loader";

export default function CSR({ isLoadingUser }) {
  const flagship = useFlagship();
  const showBanner = useFsFlag("showBanner", false).getValue(false);
  const showVIPBanner = useFsFlag("showVIPBanner", false).getValue(false);

  return (
    <div>
      <main>
        <BackToHome />
        <Heading as="h1">This page is client-side rendered</Heading>
        <FlagshipContext />
        <Box my={8}>
          {flagship.status.isLoading && <Loader text="Loading flagship..." />}
          {!flagship.status.isLoading && showBanner && (
            <ClientSideReactBanner />
          )}
        </Box>
        <Box my={8}>
          {(isLoadingUser || flagship.status.isLoading) && (
            <Stack border="solid" borderColor="gray.200" p={4}>
              <Skeleton height="20px" />
              <Text>
                You can also use a skeleton to prevent a big flickering effet
                while loading the user context...
              </Text>
              <Skeleton height="20px" />
              <Skeleton height="80px" />
            </Stack>
          )}
          {!isLoadingUser && !flagship.status.isLoading && showVIPBanner && (
            <AsynchronousBanner />
          )}
        </Box>
      </main>
      <Code path="ssr.js" />
    </div>
  );
}
