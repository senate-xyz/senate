import type { NextPage } from "next";
import Image from "next/image";

const Home: NextPage = () => {
  return (
    <div>
      <div />
      <div>
        <a href="https://dev-senate-web.onrender.com/">
          <div>
            <Image
              width="50px"
              height="50px"
              src="/logo_dark.svg"
              alt="very cool logo"
            />
            <p>Senate</p>
          </div>
        </a>
        <div />
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
      <div>
        <div>
          <div>
            <p>Join</p>
            <p>Senate!</p>

            <p>
              Start receiving notifications from your DAOs every time a new
              proposal is made!
            </p>
          </div>
        </div>

        <div>
          <div>
            <a href="/app">
              <p>Launch App</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
