import {
  Text,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Avatar,
  Link,
  HStack,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import moment from "moment";

import { TrackerProposalType } from "@senate/common-types";

const tableHeader = ["Proposal", "Description", "Time Ag", "Voted"];

export const TrackerTable = (props: { votes: any; selectedDao: any }) => {
  return (
    <TableContainer w="full">
      <Table variant="simple">
        <Thead>
          <Tr>
            {tableHeader.map((column) => {
              return <Th>{column}</Th>;
            })}
          </Tr>
        </Thead>

        {props.votes.data && (
          <Tbody>
            {props.votes.data
              .filter((vote: any) => vote.dao.name === props.selectedDao)
              .map((proposal: TrackerProposalType) => {
                return (
                  <Tr key={proposal.id}>
                    <Td>
                      <HStack>
                        <Avatar src={proposal.dao.picture}></Avatar>
                        <Link
                          // @ts-ignore
                          href={proposal.data["url"]}
                          isExternal
                          maxW="20rem"
                        >
                          <Text noOfLines={1}>{proposal.name}</Text>
                        </Link>
                        <ExternalLinkIcon mx="2px" />
                      </HStack>
                    </Td>
                    <Td maxW={"20rem"}>
                      <Text noOfLines={1}>{proposal.description}</Text>
                    </Td>
                    <Td>
                      {
                        // @ts-ignore
                        moment(proposal.data["timeEnd"]).fromNow()
                      }
                    </Td>
                    <Td>idk</Td>
                  </Tr>
                );
              })}
          </Tbody>
        )}
      </Table>
    </TableContainer>
  );
};

export default TrackerTable;
