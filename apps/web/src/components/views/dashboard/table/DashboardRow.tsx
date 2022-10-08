import {
  Text,
  Td,
  Tr,
  Avatar,
  Link,
  HStack,
  useBreakpointValue,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import moment from "moment";

export const DashboardRow = (props: { proposal: any }) => {
  const isMobile = useBreakpointValue({
    base: true,
    md: false,
  });

  return (
    <Tr key={props.proposal.id}>
      <Td>
        <HStack>
          <Avatar
            boxSize={{ base: "35px", md: "40px" }}
            src={props.proposal.dao.picture}
            position="relative"
          >
            <Avatar
              bottom={{ base: "-0.5", md: "-2" }}
              right={{ base: "-0.5", md: "-2" }}
              bg="white"
              boxSize={{ base: "15px", md: "20px" }}
              src={
                props.proposal.proposalType == "SNAPSHOT"
                  ? "https://avatars.githubusercontent.com/u/72904068?s=200&v=4"
                  : "https://assets.coingecko.com/coins/images/279/thumb/ethereum.png"
              }
              position="absolute"
            ></Avatar>
          </Avatar>
          {!isMobile && <Text>{props.proposal.dao.name}</Text>}
        </HStack>
      </Td>
      <Td>
        <HStack>
          <Link
            href={props.proposal.data["url"]}
            isExternal
            maxW={{ base: "10rem", md: "20rem" }}
          >
            <Text noOfLines={1}>{props.proposal.name}</Text>
          </Link>
          <ExternalLinkIcon mx="2px" />
        </HStack>
      </Td>

      <Td>{moment(props.proposal.data["timeEnd"]).fromNow(true)}</Td>

      <Td>idk</Td>
    </Tr>
  );
};

export default DashboardRow;
