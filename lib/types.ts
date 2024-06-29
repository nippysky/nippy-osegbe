import React from "react";

export type ButtonProps = {
  icon?: React.ReactNode;
  title: string;
};

export type TestimonyCardProps = {
  _id?: string;
  testimony: string;
  name: string;
  position: string;
};

export type ProjectProp = {
  _id?: string;
  image: string;
  name: string;
  desc: string;
  category: string;
  link: string;
};
