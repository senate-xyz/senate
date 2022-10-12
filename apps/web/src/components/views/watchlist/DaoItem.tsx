import { DAOType } from "@senate/common-types";
import { FaDiscord, FaSlack, FaTelegram, FaBell } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { useState } from "react";

export const DaoItem = (props: {
  dao: DAOType;
  handleSubscribe;
  handleUnsubscribe;
}) => {
  const { data: session } = useSession();

  const [subscribed, setSubscribed] = useState(
    props.dao.subscriptions.length > 0 ? true : false
  );

  return (
    <div>
      <p>{props.dao.name}</p>
    </div>
    // <VStack
    //   w="10rem"
    //   h="12em"
    //   p="1rem"
    //   border={subscribed ? "2px" : "1px"}
    //   bgColor={
    //     colorMode == "light"
    //       ? subscribed
    //         ? "blackAlpha.50"
    //         : "blackAlpha.300"
    //       : subscribed
    //       ? "whiteAlpha.300"
    //       : "whiteAlpha.50"
    //   }
    //   borderColor={
    //     colorMode == "light"
    //       ? subscribed
    //         ? "blackAlpha.300"
    //         : "blackAlpha.300"
    //       : subscribed
    //       ? "whiteAlpha.400"
    //       : "whiteAlpha.100"
    //   }
    //   borderRadius="5px"
    //   onClick={session ? onOpen : signedOutWarning}
    // >
    //   <Avatar size="lg" src={props.dao.picture} bg="white" position="relative">
    //     <AvatarGroup
    //       position="absolute"
    //       size="sm"
    //       max={2}
    //       bottom={{ base: "-0.5", md: "-2.5" }}
    //       right={{ base: "-0.5", md: "-2.5" }}
    //     >
    //       {props.dao.handlers.map((handler, index: number) => {
    //         switch (handler.type) {
    //           case "BRAVO1":
    //           case "BRAVO2":
    //           case "MAKER_POLL":
    //           case "MAKER_PROPOSAL":
    //             return (
    //               <Avatar
    //                 key={index}
    //                 bg="white"
    //                 name="eth"
    //                 src="https://assets.coingecko.com/coins/images/279/thumb/ethereum.png"
    //                 boxSize={{ base: "25px", md: "30px" }}
    //               />
    //             );

    //           case "SNAPSHOT":
    //             return (
    //               <Avatar
    //                 key={index}
    //                 bg="white"
    //                 name="snapshot"
    //                 src="https://avatars.githubusercontent.com/u/72904068?s=200&v=4"
    //                 boxSize={{ base: "25px", md: "30px" }}
    //               />
    //             );
    //         }
    //       })}
    //     </AvatarGroup>
    //   </Avatar>
    //   <Text>{props.dao.name}</Text>
    //   <Spacer />
    //   <HStack>
    //     <Icon as={FaDiscord} color="gray.500" />
    //     <Icon as={FaSlack} />
    //     <Icon as={FaTelegram} color="gray.500" />
    //     <Icon as={FaBell} color="gray.500" />
    //   </HStack>

    //   <Modal isOpen={isOpen} onClose={onClose} size="xs" isCentered>
    //     <ModalOverlay backdropFilter="blur(2px)" />
    //     <ModalContent>
    //       <ModalCloseButton />
    //       <ModalBody>
    //         <Center>
    //           <VStack my="1rem">
    //             <HStack>
    //               <Avatar
    //                 bg="white"
    //                 showBorder={true}
    //                 src={props.dao.picture}
    //               ></Avatar>

    //               <Text>{props.dao.name}</Text>
    //             </HStack>

    //             <HStack>
    //               <Text>Subscribed</Text>
    //               <Switch
    //                 isChecked={subscribed}
    //                 onChange={() => {
    //                   if (subscribed) {
    //                     props.handleUnsubscribe(props.dao.id);
    //                     setSubscribed(false);
    //                   } else {
    //                     props.handleSubscribe(props.dao.id);
    //                     setSubscribed(true);
    //                   }
    //                 }}
    //               ></Switch>
    //             </HStack>

    //             <Divider />
    //           </VStack>
    //         </Center>
    //       </ModalBody>
    //     </ModalContent>
    //   </Modal>
    // </VStack>
  );
};
