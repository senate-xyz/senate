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
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";

dayjs.extend(relativeTime);

import { PrismaJsonObject, TrackerProposalType } from "@senate/common-types";

const tableHeader = ["Proposal", "Description", "Time Ag", "Voted"];

export const TrackerTable = (props: { votes; selectedDao }) => {
  return (
    <TableContainer w="full">
      <Table variant="simple">
        <Thead>
          <Tr>
            {tableHeader.map((column, index) => {
              return <Th key={index}>{column}</Th>;
            })}
          </Tr>
        </Thead>

        {props.votes.data && (
          <Tbody>
            {props.votes.data
              .filter((vote) => vote.dao.name === props.selectedDao)
              .map((proposal: TrackerProposalType) => {
                return (
                  <Tr key={proposal.id}>
                    <Td>
                      <HStack>
                        <Avatar src={proposal.dao.picture}></Avatar>
                        <Link
                          href={(proposal.data as PrismaJsonObject)[
                            "url"
                          ]?.toString()}
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
                      {dayjs(
                        (proposal.data as PrismaJsonObject)[
                          "timeEnd"
                        ]?.toString()
                      ).fromNow()}
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
