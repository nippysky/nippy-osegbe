import { STACK_IMAGES } from "@/public";
import React from "react";
import Image from "next/image";

export default function TechStacks() {
  const { typescript, tailwind, javascript, nextjs, figma, react, solidity } =
    STACK_IMAGES;
  const stackArray = [
    typescript,
    tailwind,
    javascript,
    nextjs,
    figma,
    react,
    solidity,
  ];

  return (
    <div className="w-full my-28 flex flex-wrap justify-center items-center lg:px-60 px-5 gap-10">
      {stackArray.map((image, index) => (
        <Image
          key={index}
          src={image}
          alt={image}
          width={80}
          height={80}
          priority
          quality={1000}
        />
      ))}
    </div>
  );
}
