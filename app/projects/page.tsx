export const revalidate = 0;

import ProjectContainer from "@/components/ProjectContainer";
import { client } from "@/lib/sanity";
import { ProjectProp } from "@/lib/types";
import React from "react";

// Fetch Projects
async function getProjects() {
  const query = `*[_type == "projects"]{
  _id,
  name,
  desc,
  category,
  "image": image.asset->url,
  link
}`;

  const data = await client.fetch(query);
  return data;
}

export default async function Projects() {
  const projects: ProjectProp[] = await getProjects();

  return (
    <div className="w-full grid md:grid-cols-2 lg:grid-cols-3 lg:gap-5 gap-10 my-20">
      {projects.map((project) => (
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
  );
}
