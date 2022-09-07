import {
  Avatar,
  Box,
  Divider,
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Switch,
  Text,
  useDisclosure,
  Center,
  VStack,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { NotificationChannelTypes, UnsubscribedType } from "../../../../types";
import { FaDiscord, FaSlack, FaCheck } from "react-icons/fa";
import { ChevronDownIcon } from "@chakra-ui/icons";

export const UnsubscribedItem = (props: { unsub: UnsubscribedType }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <HStack
      p="1rem"
      border="1px"
      borderRadius="5px"
      borderColor={"gray.200"}
      background={"gray.100"}
      w="full"
      onClick={onOpen}
    >
      <Avatar src={props.unsub.picture}></Avatar>
      <Text>{props.unsub.name}</Text>
      <Spacer />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay backdropFilter="blur(2px)" />
        <ModalContent>
          <ModalHeader>Set notification frequency</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Center>
              <VStack>
                <HStack>
                  <Avatar src={props.unsub.picture}></Avatar>
                  <Text>{props.unsub.name}</Text>
                </HStack>
                <Divider />
                <HStack>
                  <Icon as={FaDiscord} />
                  <Switch isChecked={false}></Switch>
                </HStack>
                <HStack>
                  <Icon as={FaSlack} />
                  <Switch isChecked={false}></Switch>
                </HStack>
                <Menu>
                  <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                    Add new notification
                  </MenuButton>
                  <MenuList>
                    <MenuItem>New Proposal</MenuItem>
                    <MenuItem>3 days left to vote</MenuItem>
                    <MenuItem>2 days left to vote</MenuItem>
                    <MenuItem>1 day left to vote</MenuItem>
                    <MenuItem>12 hours left to vote</MenuItem>
                    <MenuItem>6 hours left to vote</MenuItem>
                    <MenuItem>3 hours left to vote</MenuItem>
                    <MenuItem>1 hour left to vote</MenuItem>
                  </MenuList>
                </Menu>
              </VStack>
            </Center>
          </ModalBody>
        </ModalContent>
      </Modal>
    </HStack>
  );
};
