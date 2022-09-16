import { Box, Button, Flex, HStack, Text, VStack } from "@chakra-ui/react";
import { getCsrfToken, signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { SiweMessage } from "siwe";
import { useConnect, useSignMessage, useNetwork, useAccount } from "wagmi";

// The approach used in this component shows how to build a sign in and sign out
// component that works on pages which support both client and server side
// rendering, and avoids any flash incorrect content on initial page load.
export default function Header() {
  const { data: session, status } = useSession();
  const [{ data: connectData }, connect] = useConnect();
  const [, signMessage] = useSignMessage();
  const [{ data: networkData }] = useNetwork();
  const [{ data: accountData }] = useAccount();

  const handleLogin = async () => {
    try {
      await connect(connectData.connectors[0]);

      console.log(window.location.host);

      const message = new SiweMessage({
        domain: window.location.host,
        address: accountData?.address,
        statement: "Sign in with Ethereum to the app.",
        uri: window.location.origin,
        version: "1",
        chainId: networkData?.chain?.id,
        nonce: await getCsrfToken(),
      });
      const { data: signature, error } = await signMessage({
        message: message.prepareMessage(),
      });
      signIn("credentials", {
        message: JSON.stringify(message),
        redirect: false,
        signature,
      });
    } catch (error) {
      window.alert(error);
    }
  };

  return (
    <VStack align="end">
      {session?.user ? (
        <VStack top="1rem" mr="1rem" mt="1rem" align="end">
          <Text>Signed in as {session.user.email ?? session.user.name}</Text>

          <Button
            onClick={(e) => {
              e.preventDefault();
              signOut();
            }}
          >
            <Link href={`/api/auth/signout`}> Sign out</Link>
          </Button>
        </VStack>
      ) : (
        <Button
          top="1rem"
          mr="1rem"
          mt="1rem"
          onClick={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          Sign-In with Ethereum
        </Button>
      )}
    </VStack>
  );
}
