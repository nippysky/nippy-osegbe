import { QuoteIcon } from "lucide-react";
import React from "react";

export default function TestimonyCard() {
  return (
    <section className=" rounded-xl p-10 border flex items-center text-center flex-col">
      <QuoteIcon size={50} />
      <p className="mt-5 text-[0.9rem]">
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the industry&apos;s standard dummy text
        ever since the 1500s, when an unknown printer took a galley of type and
        scrambled it to make a type specimen book. It has survived not only five
        centuries,
      </p>

      <div className="mt-10">
        <p className="font-bold">Adebis Adenanjo</p>
        <small>Software Developer</small>
      </div>
    </section>
  );
}
