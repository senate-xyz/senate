import { Button, Flex, Text } from "@chakra-ui/react";
import { getCsrfToken, signIn, signOut, useSession } from "next-auth/react";
import { SiweMessage } from "siwe";
import { useAccount, useConnect, useNetwork, useSignMessage } from "wagmi";

export const Header = () => {
  const { data: session } = useSession();

  const { connectors, connectAsync } = useConnect();
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { signMessageAsync } = useSignMessage({});

  const handleLogin = async () => {
    try {
      if (!isConnected)
        Promise.all(
          connectors.map(async (connector) => {
            await connectAsync({ connector });
          })
        );

      if (isConnected) {
        const message = new SiweMessage({
          domain: window.location.host,
          address: address,
          statement: "Sign in with Ethereum to the app.",
          uri: window.location.origin,
          version: "1",
          chainId: chain?.id,
          nonce: await getCsrfToken(),
        });
        const signature = await signMessageAsync({
          message: message.prepareMessage(),
        });

        signIn("credentials", {
          message: JSON.stringify(message),
          signature,
          redirect: false,
          callbackUrl: message.uri,
        });
      }
    } catch (error) {
      window.alert(error);
    }
  };

  return (
    <Flex w="full" align="end" justify="end">
      {isConnected && session?.user ? (
        <Flex flexDir="column" mt="2rem" mr="2rem">
          <Text>Signed in as {session.user?.name}</Text>
          <Button
            onClick={() => {
              signOut();
            }}
          >
            Sign out
          </Button>
        </Flex>
      ) : (
        <Button
          mt="2rem"
          mr="2rem"
          onClick={() => {
            handleLogin();
          }}
        >
          Sign in with Ethereum
        </Button>
      )}
    </Flex>
  );
};

export default Header;
