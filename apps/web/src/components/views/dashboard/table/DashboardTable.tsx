import { Table, TableContainer, Tbody, Th, Thead, Tr } from "@chakra-ui/react";
import DashboardRow from "./DashboardRow";

const tableHeader = ["DAO", "Proposal", "Time left", "Status"];

export const DashboardTable = (props: { proposals }) => {
  return (
    <TableContainer>
      <Table
        size={{ base: "sm", md: "md", lg: "lg" }}
        variant="striped"
        colorScheme="gray"
      >
        <Thead>
          <Tr>
            {tableHeader.map((column, index) => {
              return <Th key={index}>{column}</Th>;
            })}
          </Tr>
        </Thead>
        <Tbody>
          {props.proposals.data.map((proposal, index) => {
            return <DashboardRow key={index} proposal={proposal} />;
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default DashboardTable;
