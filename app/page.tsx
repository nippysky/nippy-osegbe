export const revalidate = 0;

import Approach from "@/components/shared/Approach";
import Hero from "@/components/shared/Hero";
import RecentProjects from "@/components/shared/RecentProjects";
import TechStacks from "@/components/shared/TechStacks";
import { client } from "@/lib/sanity";
import { ProjectProp } from "@/lib/types";

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

// Fetch About
async function getAbout() {
  const query = `*[_type == "about"]{
  cv,
  heroDesc
}`;

  const data = await client.fetch(query);
  return data;
}

export default async function Home() {
  const about = await getAbout();
  const projects: ProjectProp[] = await getProjects();

  return (
    <>
      <Hero details={about[0]} />
      <RecentProjects latestProjects={projects.slice(0, 3)} />
      <TechStacks />
      <Approach />
    </>
  );
}
