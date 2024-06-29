"use client";

import Link from "next/link";
import ProjectContainer from "../ProjectContainer";
import { TextGenerateEffect } from "../TextGenerateEffect";
import NippyButton from "../NippyButton";
import { FaLocationArrow } from "react-icons/fa6";

export default function RecentProjects() {
  return (
    <div className="py-20 w-full min-h-screen">
      <TextGenerateEffect
        words="A small selection of recent projects"
        className="text-center text-[35px] md:text-4xl lg:text-5xl"
        coloredIndexFromLastWord={3}
      />
      <div className="w-full grid md:grid-cols-2 lg:grid-cols-3 lg:gap-5 gap-10 mt-14">
        {[1, 2, 3].map((_, index) => (
          <ProjectContainer key={index} />
        ))}
      </div>

      {/* View More Projects Button */}
      <div className="w-full flex justify-center items-center mt-10">
        <Link href="/">
          <NippyButton
            icon={<FaLocationArrow size={20} />}
            title={"View all projects"}
          />
        </Link>
      </div>
    </div>
  );
}
