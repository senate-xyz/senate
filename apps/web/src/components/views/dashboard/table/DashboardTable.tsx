import DashboardRow from "./DashboardRow";

const tableHeader = ["DAO", "Proposal", "Time left", "Status"];

export const DashboardTable = (props: { proposals }) => {
  return (
    <div className="w-full">
      <table className="w-full text-sm text-left">
        <thead className="text-xs uppercase">
          <tr>
            {tableHeader.map((column, index) => {
              return (
                <th scope="col" className="py-3 px-6" key={index}>
                  {column}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {props.proposals.data.map((proposal, index) => {
            return <DashboardRow key={index} proposal={proposal} />;
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DashboardTable;
