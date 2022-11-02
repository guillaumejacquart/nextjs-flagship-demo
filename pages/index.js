import {
  Alert,
  AlertIcon,
  Badge,
  Box,
  Button,
  Code,
  Heading,
  HStack,
  ListItem,
  SimpleGrid,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  UnorderedList,
} from "@chakra-ui/react";
import Image from "next/image";
import SourceCode from "../components/common/SourceCode";
import DemoLink from "../components/home/DemoLink";
import FetchModeDefinition from "../components/home/FetchModeDefinition";
import FlagDefinition from "../components/home/FlagDefinition";
import logoPic from "../public/logo.svg";
import nextPic from "../public/next.svg";

export default function Home() {
  return (
    <>
      <Heading
        fontWeight="normal"
        as="h1"
        mb={8}
        textAlign="center"
        alignItems="center"
        lineHeight={"1.5"}
        fontSize="3xl"
      >
        <a href="https://nextjs.org" target="_blank" rel="noreferrer">
          <Box display="inline-block" top="12px" position="relative">
            <Image src={nextPic} width={100} height={50} alt="Next.js" />
          </Box>
        </a>
        <Text
          display="inline-block"
          fontStyle="italic"
          fontWeight="thin"
          mx={4}
        >
          &amp;
        </Text>
        <a href="https://www.flagship.io" target="_blank" rel="noreferrer">
          <Box display="inline-block" top="12px" position="relative">
            <Image
              src={logoPic}
              width={180}
              height={50}
              alt="Flagship platform"
            />
          </Box>
        </a>
        <br />
        Data fetching modes implementation
      </Heading>

      <Box my={2}>
        <Text>
          This website&apos;s goal is to illustrate how to use Flagship{" "}
          <Button
            as="a"
            variant="link"
            href="https://docs.developers.flagship.io/docs/react"
            target="_blank"
            rel="noreferrer"
          >
            React
          </Button>{" "}
          &amp;{" "}
          <Button
            as="a"
            variant="link"
            href="https://docs.developers.flagship.io/docs/js-sdk"
            target="_blank"
            rel="noreferrer"
          >
            Javascript SDKs
          </Button>{" "}
          in the context of Next.js.
        </Text>

        <Text>
          You can see the source code here: <SourceCode />
        </Text>
      </Box>

      <Heading as="h2" mt={12} fontSize="lg">
        Data fetching mode implementation:
      </Heading>
      <SimpleGrid minChildWidth="350px" spacing="40px" my={4}>
        <DemoLink
          href="/csr"
          title="CSR Example"
          text="Go to the Client-side rendering example"
        />
        <DemoLink
          href="/ssg"
          title="SSG Example"
          text="Go to the Static-Side generated example"
        />
        <DemoLink
          href="/ssr"
          title="SSR Example"
          text="Go to the Server-Side rendering example"
        />
        <DemoLink
          href="/middleware"
          title="Middleware"
          text="Go to the Middleware example"
          isNew
        />
      </SimpleGrid>

      <Heading as="h3" fontSize="lg" mt={12}>
        What are data fetching modes?
      </Heading>

      <Box mt={2}>
        <Text>
          Next.js offers multiple data fetching modes in order to be closest to
          website visitors needs. All those modes are well described in{" "}
          <Button
            as="a"
            variant="link"
            href="https://nextjs.org/docs/basic-features/data-fetching/overview"
            target="_blank"
            rel="noreferrer"
          >
            Next.js official documentation
          </Button>
          .
        </Text>
        <SimpleGrid minChildWidth="250px" spacing="20px" my={4}>
          <FetchModeDefinition
            name="Server-Side Rendering (SSR)"
            description={
              <>
                On every request, first render of the page&apos;s HTML is done
                on the server. Then the browser takes over and handling dynamic
                interactions.
              </>
            }
            value="true"
          />
          <FetchModeDefinition
            name="Client-Side Rendering (CSR)"
            description={
              <>
                The initial HTML returned by the server or CDN is minimal and
                does not include content. The Javascript code handles the
                content generation and dynamic interactions of the website.
              </>
            }
            value="true"
          />
          <FetchModeDefinition
            name="Static-Site Generation (SSG)"
            description={
              <>
                The initial HTML with static content is generated on the build
                step of the website, and returned as a static file from a CDN or
                a static server. Then the browser takes over and handling
                dynamic interactions.
              </>
            }
            value="true"
          />
        </SimpleGrid>

        <Text mt={12}>
          These different data fetching methods comes with advantages and
          drawbacks in the context of feature flagging:
        </Text>

        <TableContainer border="solid" borderWidth={1} borderColor="gray.200">
          <Table variant="striped">
            <Thead>
              <Tr>
                <Th>Method</Th>
                <Th maxW="100px">Advantages</Th>
                <Th>Drawbacks</Th>
              </Tr>
            </Thead>
            <Tbody fontSize="sm">
              <Tr>
                <Td>Client-side rendering</Td>
                <Td>
                  <UnorderedList>
                    <ListItem>Fast loading of the page</ListItem>
                    <ListItem>Everything handled in JS</ListItem>
                  </UnorderedList>
                </Td>
                <Td>
                  <UnorderedList>
                    <ListItem>
                      No targeting context on page load <br />
                      (except technical such as browser info)
                    </ListItem>
                    <ListItem>Targeting context requires ajax calls</ListItem>
                    <ListItem>
                      Flag loading asynchronous
                      <br />
                      (require loader state or flickering)
                    </ListItem>
                  </UnorderedList>
                </Td>
              </Tr>
              <Tr>
                <Td>Server-side rendering</Td>
                <Td>
                  <UnorderedList>
                    <ListItem>Flagging can be done on the server</ListItem>
                    <ListItem>
                      Targeting context fetched before rendering
                    </ListItem>
                    <ListItem>
                      Renders an already flagged HTML page:
                      <br />
                      No loading state or flickering on page load
                    </ListItem>
                  </UnorderedList>
                </Td>
                <Td>
                  <UnorderedList>
                    <ListItem>
                      Requires a server running to serve the pages
                    </ListItem>
                    <ListItem>Initial page load can be slower</ListItem>
                  </UnorderedList>
                </Td>
              </Tr>
              <Tr>
                <Td>Static-site generation</Td>
                <Td>
                  <UnorderedList>
                    <ListItem>Fast loading of the page</ListItem>
                    <ListItem>
                      Generic pages (not specific to a visitor)
                      <br />
                      can be flagged on page load
                    </ListItem>
                  </UnorderedList>
                </Td>
                <Td>
                  <UnorderedList>
                    <ListItem>
                      No visitor targeting context on page load <br />
                      (except technical such as browser info)
                    </ListItem>
                    <ListItem>
                      Visitor context fetching requires ajax calls
                    </ListItem>
                    <ListItem>
                      Visitor specific flagging asynchronous
                      <br />
                      (require loader state or flickering)
                    </ListItem>
                  </UnorderedList>
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
      </Box>

      <Heading as="h3" fontSize="lg" mt={12}>
        Flagship configuration
      </Heading>
      <Box mt={4}>
        <Text mb={2}>
          For this demo, we have setup 2 flags on{" "}
          <Button
            as="a"
            variant="link"
            href="https://app.flagship.io"
            target="_blank"
            rel="noreferrer"
          >
            the Flagship platform
          </Button>
          :
        </Text>

        <HStack justifyContent="center" spacing="24px" width="100%">
          <FlagDefinition
            name="showBanner"
            targeting="All users"
            value="true"
            defaultValue="false"
          />
          <FlagDefinition
            name="showVIPBanner"
            targeting={`{ "isVip": true }`}
            value="true"
            defaultValue="false"
          />
        </HStack>

        <Alert status="info" mt={4}>
          <AlertIcon />
          <Text>
            As you can see, the <Code>showBanner</Code> flag targets all users,
            and thus can be pre-loaded when building the page in SSG or
            rendering the page in SSR.
            <br />
            For Client-side rendered pages, an initial call to Flagship services
            will be required to get the flag, thus leading to a loading state or
            a flickering.
          </Text>
        </Alert>

        <Alert status="warning" mt={4}>
          <AlertIcon />
          <Text>
            On the other hand, the <Code>showVIPBanner</Code> flag targets only
            VIP visitors.
            <br />
            To known whether the visitor is VIP or not, we simulate an API call
            to get the user profile. This API call can be done on the server
            (when using Server-side rendering) or on the client (for Client-side
            rendering or Static-site generation)
            <br />
            This means that the <Code>showVIPBanner</Code> will be available on
            page load for Server-side rendered page, and after a flickering or
            loading state for Client-side rendered or Static-side generated
            pages.
          </Text>
        </Alert>
      </Box>
    </>
  );
}
