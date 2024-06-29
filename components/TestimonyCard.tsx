import { TestimonyCardProps } from "@/lib/types";
import { QuoteIcon } from "lucide-react";
import React from "react";

export default function TestimonyCard({
  testimonial,
}: {
  testimonial: TestimonyCardProps;
}) {
  return (
    <section className="rounded-xl p-10 border flex items-center text-center flex-col">
      <QuoteIcon size={50} />
      <p className="mt-5 text-[0.9rem]">{testimonial.testimony}</p>

      <div className="mt-10">
        <p className="font-bold">{testimonial.name}</p>
        <small className=" text-gray-400">{testimonial.position}</small>
      </div>
    </section>
  );
}
