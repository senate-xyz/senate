import { useSession } from "next-auth/react";
import { trpc } from "../../../utils/trpc";
import DashboardTable from "./table/DashboardTable";

export const DashboardView = (props: { proposals }) => (
  <div className="w-full">
    <p>Dashboard</p>
    <div className="w-full">
      <DashboardTable proposals={props.proposals} />
    </div>
  </div>
);

export const Dashboard = () => {
  const { data: session } = useSession();

  const proposals = trpc.useQuery([
    session ? "user.proposals" : "public.proposals",
  ]);

  if (proposals.isLoading) return <div>Loading</div>;

  if (!proposals.isLoading && !proposals.data)
    return (
      <div>
        No data. New accounts require up to 10 minutes to fetch new data...
      </div>
    );

  return <DashboardView proposals={proposals} />;
};

export default Dashboard;
