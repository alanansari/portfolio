import { Sidebar } from "@/components/Sidebar";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Now } from "@/components/sections/Now";
import { Experience } from "@/components/sections/Experience";
import { Skills } from "@/components/sections/Skills";
import { Projects } from "@/components/sections/Projects";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import {
  getExperience,
  getProfile,
  getProjects,
  getSkills,
  getSocials,
} from "@/lib/content";
import { getLiveStats } from "@/lib/activity";

export default async function HomePage() {
  const [profile, experience, skills, projects, socials] = await Promise.all([
    getProfile(),
    getExperience(),
    getSkills(),
    getProjects(),
    getSocials(),
  ]);

  const statsForNow = await getLiveStats(socials);

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[280px_1fr]">
      <Sidebar profile={profile} />
      <main className="max-w-full overflow-x-hidden lg:min-w-0">
        <Hero profile={profile} />
        <About profile={profile} />
        <Now profile={profile} stats={statsForNow} socials={socials} />
        <Experience items={experience} />
        <Skills items={skills} />
        <Projects items={projects} />
        <Contact socials={socials} stats={statsForNow} />
        <Footer />
      </main>
    </div>
  );
}
