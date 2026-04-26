import { groq } from "next-sanity";

export const profileQuery = groq`*[_type == "profile"][0]{
  name, initial, location, role, availability, statusNote,
  kicker, headline, headlineAccent, tagline,
  aboutLede, aboutFacts[]{ key, value, accent },
  currentlyBuilding, resumeUrl
}`;

export const experienceQuery = groq`*[_type == "experience"] | order(order asc){
  _id, role, company, companyUrl, locationLine, period, order,
  points, stack
}`;

export const skillsQuery = groq`*[_type == "skillCategory"] | order(order asc){
  _id, title, order, skills
}`;

export const projectsQuery = groq`*[_type == "project"] | order(order asc){
  _id, title, description, role, year, order,
  image, viz, projectUrl, tech
}`;

export const socialsQuery = groq`*[_type == "social"] | order(order asc){
  _id, label, platform, handle, url, order
}`;
