import { FaLocationArrow } from "react-icons/fa6";
import { socialMedia } from "@/lib/data";
import Image from "next/image";
import { IMAGES } from "@/public";
import { ThemeToggler } from "../theme-toggler";
import NippyButton from "../NippyButton";
import { TextGenerateEffect } from "../TextGenerateEffect";

const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="w-full relative h-screen flex flex-col justify-center">
      {/* background grid */}
      <Image
        src={IMAGES.grid}
        alt="Grid"
        fill
        className=" absolute opacity-50 object-cover object-center"
      />

      <div className="flex flex-col items-center z-10">
        <TextGenerateEffect
          words="Ready to take your digital presence to the next level?"
          className="text-center text-[35px] md:text-4xl lg:text-5xl"
          coloredIndexFromLastWord={3}
        />
        <a href="mailto:nsinfo247@gmail.com">
          <NippyButton
            icon={<FaLocationArrow size={20} />}
            title={"Let's get in touch"}
          />
        </a>
      </div>

      <div className="flex mt-16 md:flex-row flex-col justify-between items-center gap-10">
        <p className=" text-[0.85rem] md:font-normal font-light">
          Copyright for NIPPYSKY © {currentYear}
        </p>

        <div className="w-full lg:w-1/2 items-center gap-20 lg:justify-end justify-between flex">
          <div className="flex items-center md:gap-3 gap-6">
            {socialMedia.map((info) => (
              <a
                href={info.link}
                rel="noopener noreferrer"
                target="_blank"
                key={info.id}
                className="w-10 h-10 flex justify-center items-center backdrop-filter backdrop-blur-lg saturate-180 bg-opacity-75 bg-black-200 rounded-lg border border-black-300"
              >
                {info.img}
              </a>
            ))}
          </div>

          {/* Theme Toggle */}
          <ThemeToggler />
        </div>
      </div>
    </footer>
  );
}
