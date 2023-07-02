import { getVoters } from "./actions";
import { Voters } from "./components/Voters";

export default async function Home() {
  const voters = await getVoters();

  return (
    <div className="flex min-h-screen flex-col gap-12">
      <div className="flex flex-col gap-4">
        <div className="text-[24px] font-light leading-[30px] text-white">
          Your Other Addresses
        </div>

        <div className="text-[18px] font-light leading-[23px] text-white lg:w-[50%]">
          Here you can add other addresses to your Senate account, so that you
          can see the voting activity for those addresses as well.
        </div>

        <Voters voters={voters} />
      </div>
    </div>
  );
}
