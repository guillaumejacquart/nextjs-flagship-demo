import { Box, Center, Flex, Heading, Text } from "@chakra-ui/react";
import Head from "next/head";
import DemoLink from "../components/home/DemoLink";

export default function Home() {
  return (
    <div>

      <main>
        <Heading as="h1" mb={8} textAlign="center">
          Welcome to <a href="https://nextjs.org">Next.js!</a> &amp;{" "}
          <a href="https://www.flagship.io">Flagship</a> Demo
        </Heading>

        <Flex alignItems="center" justifyContent="center">
          <DemoLink
            href="/ssr"
            title="SSR Example"
            text="Go to the Server-Side generated example"
          />
          <DemoLink
            href="/ssg"
            title="SSG Example"
            text="Go to the Static-Side generated example"
          />
        </Flex>
      </main>

      <footer></footer>
    </div>
  );
}
