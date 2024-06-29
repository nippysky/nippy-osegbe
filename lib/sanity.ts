import { createClient } from "next-sanity";
import { formatDate } from "./utils";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_ID,
  dataset: "production",
  apiVersion: formatDate(new Date()),
  useCdn: false,
});
