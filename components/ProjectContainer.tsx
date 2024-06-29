import { PROJECT_IMAGES } from "@/public";
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

export default function ProjectContainer() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <section className="rounded-xl p-5 bg-transparent w-full h-auto border">
            {/* Image */}
            <div className="w-full h-36 relative overflow-hidden rounded-xl">
              <Image
                src={PROJECT_IMAGES.p3}
                alt="Image"
                fill
                className="object-center object-cover"
              />
            </div>

            {/* Project Title*/}
            <h4 className=" font-bold text-[0.85rem] my-2 tracking-wide">
              Come one
            </h4>

            {/* Project desc */}
            <small className=" line-clamp-3">
              lorewns asmhjb dakj,dbuak kwag,kb cWAK,BKDSA DSqwdamgmjwq
              adsjavdyuqja ssajuGBKY8UWE AKSAJG,ZF7BCAIS JSAMJBFYSAb\
              kusa\gzf,baAx
            </small>

            {/* Project Category */}
            <p className="mt-3 font-semibold text-gray-400 text-[0.7rem] tracking-wide">
              MOBILE DEVELOPMENT
            </p>

            {/* Project site link */}

            <Link
              href="/"
              className="text-[0.85rem] items-center gap-2 flex font-semibold h-12 hover:text-primary"
            >
              <p>Visit live</p>
              <MoveRight size={20} />
            </Link>
          </section>
        </TooltipTrigger>
        <TooltipContent className="my-1">
          <a
            href="http://nippysky.com"
            rel="noopener noreferrer"
            target="_blank"
          >
            Visit website
          </a>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
