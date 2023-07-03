import UserAddress from "./components/UserAddress";
import Testing from "./components/Testing";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col gap-12">
      <div className="flex flex-col gap-4">
        <div className="text-[24px] font-light leading-[30px] text-white">
          Your Account
        </div>

        <UserAddress />
        <Testing />
      </div>
    </div>
  );
}
