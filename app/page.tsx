import Certificates from "@/sections/Certificates";
import Hero from "@/sections/Hero";
import Projects from "@/sections/Projects";
import Reviews from "@/sections/Reviews";
import Skills from "@/sections/Skills";
import XP from "@/sections/XP";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Skills />
      <XP />
      <Projects />
      <Certificates />
      <Reviews />
      {/* More sections coming: Projects, Skills, Experience, Reviews, Certificates */}
    </main>
  );
}
