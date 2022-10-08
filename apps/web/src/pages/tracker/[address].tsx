import type { NextPage } from "next";
import { Box } from "@chakra-ui/react";

import { useRouter } from "next/router";
import TrackerView from "../../components/views/tracker/Tracker";

const Home: NextPage = () => {
  const router = useRouter();
  const { address } = router.query;

  return (
    <Box w="full">
      <TrackerView address={String(address)} shareButton={false} />
    </Box>
  );
};

export default Home;
