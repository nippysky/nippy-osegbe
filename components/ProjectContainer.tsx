import Image from "next/image";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { MoveRight } from "lucide-react";
import { ProjectProp } from "@/lib/types";

export default function ProjectContainer({
  image,
  name,
  desc,
  category,
  link,
}: ProjectProp) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <section className="rounded-xl p-5 bg-transparent w-full h-auto border">
            {/* Image */}
            <div className="w-full h-36 relative overflow-hidden rounded-xl">
              <Image
                src={image}
                alt={name}
                fill
                className="object-center object-cover"
              />
            </div>

            {/* Project Title*/}
            <h4 className=" font-bold text-[0.85rem] my-2 tracking-wide">
              {name}
            </h4>

            {/* Project desc */}
            <small className=" line-clamp-3">{desc}</small>

            {/* Project Category */}
            <p className="mt-3 font-semibold text-gray-400 text-[0.7rem] tracking-wide">
              {category === "web" ? "WEB DEVELOPMENT" : "MOBILE DEVELOPMENT"}
            </p>

            {/* Project site link */}

            <Link
              href={link}
              className="text-[0.85rem] items-center gap-2 flex font-semibold h-12 hover:text-primary"
            >
              <p>Visit live</p>
              <MoveRight size={20} />
            </Link>
          </section>
        </TooltipTrigger>
        <TooltipContent className="my-1 uppercase tracking-wide">
          <a href={link} rel="noopener noreferrer" target="_blank">
            {name}
          </a>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
