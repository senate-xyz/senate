import { Flex, Avatar, Text } from "@chakra-ui/react";
import { DaoType } from "../../../types";

export const SubscriptionItem = (props: { dao: DaoType }) => {
  return (
    <Flex
      key={props.dao.id}
      m="2rem"
      align="center"
      flexDir="column"
      border="1px"
      borderRadius="5px"
      borderColor="gray.400"
    >
      <Avatar src={props.dao.image}></Avatar>
      <Text>{props.dao.name}</Text>
    </Flex>
  );
};
