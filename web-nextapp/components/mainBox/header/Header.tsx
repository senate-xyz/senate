import { Button, Text, VStack } from "@chakra-ui/react";
import { getCsrfToken, signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SiweMessage } from "siwe";
import {
  useConnect,
  useSignMessage,
  useNetwork,
  useAccount,
  useDisconnect,
} from "wagmi";

export default function Header() {
  const { data: session } = useSession();

  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();
  const { address, isConnected } = useAccount();
  const [message, setMessage] = useState("");
  const { signMessage } = useSignMessage({
    message: message,
    onSuccess(signature) {
      console.log(message);
      console.log(signature);
      signIn("credentials", {
        message: message,
        redirect: false,
        signature,
      });
    },
  });

  const handleLogin = async () => {
    try {
      if (!isConnected)
        connectors.map(async (connector) => {
          await connect({ connector });
        });

      const tmpmessage = new SiweMessage({
        domain: window.location.host,
        address: address,
        statement: "Sign in with Ethereum to the app.",
        uri: window.location.origin,
        version: "1",
        chainId: chain?.id,
        nonce: await getCsrfToken(),
      });

      setMessage(tmpmessage.prepareMessage());
    } catch (error) {
      window.alert(error);
    }
  };

  useEffect(() => {
    if (message.length > 0) signMessage();
  }, [message]);

  return (
    <VStack align="end">
      {session?.user ? (
        <VStack top="1rem" mr="1rem" mt="1rem" align="end">
          <Text>Signed in as {session.user.email ?? session.user.name}</Text>

          <Button
            onClick={(e) => {
              e.preventDefault();
              signOut();
              disconnect();
            }}
          >
            <Link href={`/api/auth/signout`}>Sign out</Link>
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
