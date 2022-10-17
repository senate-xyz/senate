import type { NextPage } from "next";
import Image from "next/image";

const Header = () => {
  return (
    <div className="flex max-w-full justify-between">
      <div className="m-2">
        <a href="https://dev-senate-web.onrender.com/">
          <div className="flex justify-start items-center">
            <Image
              width="50px"
              height="50px"
              src="/logo_dark.svg"
              alt="very cool logo"
            />
            <p>Senate</p>
          </div>
        </a>
      </div>
      <div className="flex gap-3 m-3">
        <a href="/about">
          <p>About</p>
        </a>
        <a href="/faq">
          <p>FAQ</p>
        </a>
        <a href="https://twitter.com/SenateLabs">
          <p>Twitter</p>
        </a>
        <a href="https://github.com/senate-xyz/senate">
          <p>Github</p>
        </a>
        <a href="https://discord.gg/pX7JNetz">
          <p>Discord</p>
        </a>
      </div>
    </div>
  );
};

const Mid = () => {
  return (
    <div className="flex gap-4 justify-between">
      <div className="flex flex-col w-full items-center">
        <div className="flex flex-col">
          <p>Join</p>
          <p>Senate!</p>
        </div>
        <p className="w-96 m-4">
          Start receiving notifications from your DAOs every time a new proposal
          is made!
        </p>

        <div className="justify-center content-center">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            <a href="/app">
              <p>Launch App</p>
            </a>
          </button>
        </div>
      </div>

      <div>
        <Image
          width="500"
          height="500"
          src="/homeart.svg"
          alt="very cool graphics"
        />
      </div>
    </div>
  );
};

const Footer = () => {
  return <div></div>;
};

const Home: NextPage = () => {
  return (
    <div>
      <Header />
      <Mid />
      <Footer />
    </div>
  );
};

export default Home;
