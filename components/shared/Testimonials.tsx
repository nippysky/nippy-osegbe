"use client";

import React, { useEffect, useState } from "react";
import { TextGenerateEffect } from "../TextGenerateEffect";
import TestimonyCard from "../TestimonyCard";
import { TestimonyCardProps } from "@/lib/types";

export default function Testimonials({
  testimonials,
}: {
  testimonials: TestimonyCardProps[];
}) {
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonialIndex(
        (prevIndex) => (prevIndex + 1) % testimonials.length
      );
    }, 15000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const getNextTestimonialIndex = (index: number): number =>
    (index + 1) % testimonials.length;

  return (
    <section className="w-full min-h-screen flex flex-col justify-center">
      <TextGenerateEffect
        words="Kind words of recommendation"
        className="text-center text-[35px] md:text-4xl lg:text-5xl mt-10"
        coloredIndexFromLastWord={2}
      />

      <div className="w-full mt-10 grid md:grid-cols-2 gap-5">
        <TestimonyCard testimonial={testimonials[currentTestimonialIndex]} />
        <TestimonyCard
          testimonial={
            testimonials[getNextTestimonialIndex(currentTestimonialIndex)]
          }
        />
      </div>
    </section>
  );
}
