import { FaLocationArrow } from "react-icons/fa6";
import MagicButton from "../MagicButton";
import { socialMedia } from "@/lib/data";
import Image from "next/image";
import { IMAGES } from "@/public";
import { ThemeToggler } from "../theme-toggler";

export default function Footer() {
  return (
    <footer className="w-full relative">
      {/* background grid */}
      <Image
        src={IMAGES.footerGrid}
        alt="Footer Grid"
        fill
        className=" absolute opacity-50 object-cover object-center"
      />

      <div className="flex flex-col items-center z-10">
        <h1 className=" lg:max-w-[45vw]">
          Ready to take <span className="">your</span> digital presence to the
          next level?
        </h1>
        <p className="text-white-200 md:mt-10 my-5 text-center">
          Reach out to me today and let&apos;s discuss how I can help you
          achieve your goals.
        </p>
        <a href="mailto:contact@jsmastery.pro">
          <MagicButton
            title="Let's get in touch"
            icon={<FaLocationArrow />}
            position="right"
          />
        </a>
      </div>

      <div className="flex mt-16 md:flex-row flex-col justify-between items-center gap-10">
        <p className=" text-[0.85rem] md:font-normal font-light">
          Copyright for NIPPYSKY © 2024
        </p>

        <div className="w-full lg:w-1/2 items-center gap-20 lg:justify-end justify-between flex">
          <div className="flex items-center md:gap-3 gap-6">
            {socialMedia.map((info) => (
              <div
                key={info.id}
                className="w-10 h-10 cursor-pointer flex justify-center items-center backdrop-filter backdrop-blur-lg saturate-180 bg-opacity-75 bg-black-200 rounded-lg border border-black-300"
              >
                {info.img}
              </div>
            ))}
          </div>

          {/* Theme Toggle */}
          <ThemeToggler />
        </div>
      </div>
    </footer>
  );
}
