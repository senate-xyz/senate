import type { NextPage } from "next";

import { useRouter } from "next/router";
import TrackerView from "../../components/views/tracker/Tracker";

const Home: NextPage = () => {
  const router = useRouter();
  const { address } = router.query;

  return (
    <div>
      <TrackerView address={String(address)} shareButton={false} />
    </div>
  );
};

export default Home;
