/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import { TextGenerateEffect } from "../TextGenerateEffect";
import TestimonyCard from "../TestimonyCard";

export default function Testimonials() {
  return (
    <section id="testimonials">
      <TextGenerateEffect
        words="Kind words from satisfied clients"
        className="text-center text-[35px] md:text-4xl lg:text-5xl"
        coloredIndexFromLastWord={3}
      />

      <div className="w-full mt-10 grid md:grid-cols-2 gap-5">
        {[1, 2].map((_, index) => (
          <TestimonyCard key={index} />
        ))}
      </div>
    </section>
  );
}
