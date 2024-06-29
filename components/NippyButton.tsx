import React from "react";
import { Button } from "./ui/button";
import { ButtonProps } from "@/lib/types";

export default function NippyButton({ title, icon }: ButtonProps) {
  return (
    <Button className="w-full flex items-center gap-3 justify-center text-white h-12 px-10">
      <p className="tetx-[0.75rem] tracking-wide">{title}</p>
      {icon}
    </Button>
  );
}
