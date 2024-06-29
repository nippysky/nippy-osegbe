"use client";

import Link from "next/link";
import ProjectContainer from "../ProjectContainer";
import { TextGenerateEffect } from "../TextGenerateEffect";
import NippyButton from "../NippyButton";
import { FaLocationArrow } from "react-icons/fa6";
import { ProjectProp } from "@/lib/types";

export default function RecentProjects({
  latestProjects,
}: {
  latestProjects: ProjectProp[];
}) {
  return (
    <div className="py-20 w-full min-h-screen" id="recent-projects">
      <TextGenerateEffect
        words="A small selection of recent projects"
        className="text-center text-[35px] md:text-4xl lg:text-5xl"
        coloredIndexFromLastWord={3}
      />
      <div className="w-full grid md:grid-cols-2 lg:grid-cols-3 lg:gap-5 gap-10 mt-14">
        {latestProjects.map((project) => (
          <ProjectContainer
            key={project._id}
            image={project.image}
            name={project.name}
            desc={project.desc}
            category={project.category}
            link={project.link}
          />
        ))}
      </div>

      {/* View More Projects Button */}
      <div className="w-full flex justify-center items-center mt-20">
        <Link href="./projects">
          <NippyButton
            icon={<FaLocationArrow size={20} />}
            title={"View all projects"}
          />
        </Link>
      </div>
    </div>
  );
}
