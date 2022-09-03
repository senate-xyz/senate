import type { NextPage } from "next";
import { useEffect } from "react";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Always do navigations after the first render
    router.push("/proposals", undefined, { shallow: true });
  }, [router]);

  return <div />;
};

export default Home;
