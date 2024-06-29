"use client";

import { FaLocationArrow } from "react-icons/fa6";

import Link from "next/link";
import { TextGenerateEffect } from "../TextGenerateEffect";
import NippyButton from "../NippyButton";
import { IMAGES } from "@/public";
import Image from "next/image";
import { Button } from "../ui/button";
import { MoveRight } from "lucide-react";

export default function Hero() {
  return (
    <div className="lg:pb-20 relative">
      {/* background grid */}
      <Image
        src={IMAGES.grid}
        alt="Grid"
        fill
        className=" absolute opacity-50 object-cover object-center"
      />
      <div className="h-screen w-full absolute top-0 left-0 flex items-center justify-center">
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center " />
      </div>

      <div className="flex justify-center relative my-20 z-10">
        <div className="max-w-[89vw] md:max-w-2xl lg:max-w-[60vw] flex flex-col items-center justify-center">
          <p className="uppercase tracking-widest text-xs text-center max-w-80">
            NIPPY THE CREATOR
          </p>

          <TextGenerateEffect
            words="Transforming Ideas into Seamless User Experiences"
            className="text-center text-[35px] md:text-5xl lg:text-6xl"
            coloredIndexFromLastWord={3}
          />

          <p className="text-center md:tracking-wider text-sm md:text-lg lg:text-xl lg:px-24">
            Hi! I&apos;m Chukwudubem Osegbe, a Software Developer with
            experience in Cloud Computing and Linux Administration.
          </p>

          <div className=" mt-10 w-full flex flex-col md:flex-row justify-center items-center gap-5 px-5">
            <Link href="#about">
              <NippyButton
                icon={<FaLocationArrow size={20} />}
                title={"Show my work"}
              />
            </Link>

            <Link
              href="/"
              className="text-[0.85rem] items-center gap-2 flex justify-center font-semibold h-12 hover:text-primary"
            >
              <p>See my work experience</p>
              <MoveRight size={20} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
