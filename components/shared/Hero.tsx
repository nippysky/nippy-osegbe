import { FaLocationArrow } from "react-icons/fa6";

import MagicButton from "../MagicButton";
import Link from "next/link";
import { TextGenerateEffect } from "../TextGenerateEffect";

export default function Hero() {
  return (
    <div className="pb-20">
      <div className="h-screen w-full absolute top-0 left-0 flex items-center justify-center">
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center " />
      </div>

      <div className="flex justify-center relative my-20 z-10">
        <div className="max-w-[89vw] md:max-w-2xl lg:max-w-[60vw] flex flex-col items-center justify-center">
          <p className="uppercase tracking-widest text-xs text-center max-w-80">
            NIPPY THE CREATOR
          </p>

          <TextGenerateEffect
            words="Transforming Concepts into Seamless User Experiences"
            className="text-center text-[40px] md:text-5xl lg:text-6xl"
          />

          <p className="text-center md:tracking-wider mb-4 text-sm md:text-lg lg:text-2xl">
            Hi! I&apos;m NIPPY. A Software Developer, Cloud & Server
            Administrator, Cybesecurity Enthusiat.
          </p>

          <Link href="#about">
            <MagicButton
              title="Show my work"
              icon={<FaLocationArrow />}
              position="right"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
