import { Table, TableContainer, Tbody, Th, Thead, Tr } from "@chakra-ui/react";
import { TrackerProposalType } from "@senate/common-types";
import DashboardRow from "./DashboardRow";

const tableHeader = ["DAO", "Proposal", "Time left", "Status"];

export const DashboardTable = (props: { proposals: any }) => {
  return (
    <TableContainer>
      <Table
        size={{ base: "sm", md: "md", lg: "lg" }}
        variant="striped"
        colorScheme="gray"
      >
        <Thead>
          <Tr>
            {tableHeader.map((column) => {
              return <Th>{column}</Th>;
            })}
          </Tr>
        </Thead>
        <Tbody>
          {props.proposals.data.map((proposal: TrackerProposalType) => {
            return proposal.data && <DashboardRow proposal={proposal} />;
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default DashboardTable;
