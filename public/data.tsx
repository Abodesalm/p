import skill from "@/types/skill";
import {
  SiHtml5,
  SiCss3,
  SiJavascript,
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiRedux,
  SiExpress,
  SiTailwindcss,
  SiSass,
  SiMongodb,
  SiRedis,
  SiAxios,
  SiGit,
  SiBlender,
  SiAdobeillustrator,
  SiPython,
  SiKotlin,
  SiLinux,
} from "react-icons/si";
import { RxComponent2 } from "react-icons/rx";
import {
  BsFilm,
  BsServer,
  BsCpuFill,
  BsDiagram3Fill,
  BsWifi,
  BsFiles,
} from "react-icons/bs";
import {
  FaDiscord,
  FaFacebook,
  FaGithub,
  FaGlobe,
  FaGlobeAmericas,
  FaInstagram,
  FaLinkedin,
  FaSteam,
  FaTelegram,
  FaWhatsapp,
} from "react-icons/fa";
import XPItem from "@/types/xp";
import Project from "@/types/project";
import Certificate from "@/types/cert";
import Review from "@/types/review";
import link from "@/types/link";

let space = "local";
let API_URL;
if (space === "local") {
  API_URL = `http://127.0.0.1:8000`;
} else if (space === "host") {
  API_URL = `https://zed-games-api.onrender.com`;
}

const api = {
  main_api: `${API_URL}/api`,
};

export const skills: skill[] = [
  // web
  { title: "HTML", icon: <SiHtml5 />, section: "web", color: "#e34f26" },
  { title: "CSS", icon: <SiCss3 />, section: "web", color: "#1572b6" },
  {
    title: "JavaScript",
    icon: <SiJavascript />,
    section: "web",
    color: "#f7df1e",
  },
  {
    title: "TypeScript",
    icon: <SiTypescript />,
    section: "web",
    color: "#3178c6",
  },
  { title: "React", icon: <SiReact />, section: "web", color: "#61dafb" },
  { title: "Next.js", icon: <SiNextdotjs />, section: "web", color: "#a0a0a0" },
  { title: "Redux", icon: <SiRedux />, section: "web", color: "#764abc" },
  { title: "Express", icon: <SiExpress />, section: "web", color: "#a0a0a0" },
  {
    title: "Tailwind",
    icon: <SiTailwindcss />,
    section: "web",
    color: "#38bdf8",
  },
  { title: "SASS", icon: <SiSass />, section: "web", color: "#cc6699" },
  { title: "ShadCN", icon: <RxComponent2 />, section: "web", color: "#a0a0a0" },
  { title: "MongoDB", icon: <SiMongodb />, section: "web", color: "#47a248" },
  { title: "Redis", icon: <SiRedis />, section: "web", color: "#dc382d" },
  { title: "Axios", icon: <SiAxios />, section: "web", color: "#5a29e4" },
  // mobile
  { title: "Kotlin", icon: <SiKotlin />, section: "mobile", color: "#7f52ff" },
  // graphic
  {
    title: "Blender",
    icon: <SiBlender />,
    section: "graphic",
    color: "#f5792a",
  },
  {
    title: "Illustrator",
    icon: <SiAdobeillustrator />,
    section: "graphic",
    color: "#ff9a00",
  },
  { title: "DaVinci", icon: <BsFilm />, section: "graphic", color: "#cc0000" },
  // general
  {
    title: "Git",
    icon: <SiGit />,
    section: "general",
    color: "#f05032",
    level: "",
  },
  { title: "Python", icon: <SiPython />, section: "general", color: "#3776ab" },
  { title: "Linux", icon: <SiLinux />, section: "general", color: "#fcc624" },
  {
    title: "Servers",
    icon: <BsServer />,
    section: "general",
    color: "#22c55e",
  },
  {
    title: "Hardware",
    icon: <BsCpuFill />,
    section: "general",
    color: "#a0a0a0",
  },
  {
    title: "ERD",
    icon: <BsDiagram3Fill />,
    section: "general",
    color: "#22c55e",
  },
  { title: "CCNA", icon: <BsWifi />, section: "general", color: "#1ba0d7" },
  {
    title: "MS Office",
    icon: <BsFiles />,
    section: "general",
    color: "#d83b01",
  },
  // lang
  {
    title: "Arabic",
    icon: "Ar",
    section: "lang",
    level: "Native",
    color: "#22c55e",
  },
  {
    title: "English",
    icon: "En",
    section: "lang",
    level: "Fluent",
    color: "#22c55e",
  },
  {
    title: "German",
    icon: "Ge",
    section: "lang",
    level: "Good",
    color: "#22c55e",
  },
  {
    title: "French",
    icon: "Fr",
    section: "lang",
    level: "Limited",
    color: "#22c55e",
  },
  {
    title: "Spanish",
    icon: "Sp",
    section: "lang",
    level: "Limited",
    color: "#22c55e",
  },
];

export const xps: XPItem[] = [
  {
    title: "Freelancer",
    place: "Self-employed",
    start: "Nov 2022",
    end: "Present",
    desc: "Developed and designed websites, branding materials, and offered training for clients. Recognized within the freelance and content creators' community for strong technical support and creative solutions.",
    type: "job",
  },
  {
    title: "Programming Team Leader",
    place: "MYTE — Saudi Arabia",
    start: "Jun 2023",
    end: "Apr 2024",
    desc: "Led the programming department of MYTE, a Saudi digital services company. Successfully improved project turnaround time and delivery quality before the company was shut down for legal reasons.",
    type: "job",
  },
  {
    title: "Front-End Web Developer",
    place: "Virgo",
    start: "Nov 2024",
    end: "Feb 2025",
    desc: "Worked on the front-end development of a Hajj and Umrah software system. Developed the UI using modern technologies, although the project was later discontinued.",
    type: "job",
  },
  {
    title: "Games Designer",
    place: "Indie Projects",
    start: "Jun 2024",
    end: "Mar 2025",
    desc: "Designed documentation and game concepts for indie game developers. Handed over responsibilities due to external commitments.",
    type: "job",
  },
  {
    title: "Podcast Founder",
    place: "Muallak",
    start: "Jul 2025",
    end: "Present",
    desc: "Founded the podcast from scratch and managed everything related to it; recording, video editing, designing and marketing.",
    type: "job",
  },
  {
    title: "Storekeeper & IT Specialist",
    place: "Telcom Internet Company",
    start: "Aug 2025",
    end: "Nov 2025",
    desc: "Worked as storekeeper and IT specialist simultaneously. Managed storage and started developing an internal management system, also helped setting up some of their servers.",
    type: "job",
  },
  {
    title: "IT Specialist",
    place: "Telcom Internet Company",
    start: "Nov 2025",
    end: "Jan 2026",
    desc: "Continued developing the system remotely from home while studying in another city. Completed and set up the full system for the company.",
    type: "job",
  },
];

export const projects: Project[] = [
  {
    title: "Gericht restaurant",
    desc: "A fully responsive restaurant website. Features a modern landing page, Designed with a clean and appetizing UI optimized for all screen sizes.",
    date: "2023-10",
    cover: "/img/restaurant/cover.png",
    type: "web",
    tags: ["React", "Plain", "css", "JavaScript"],
    action1: { label: "Live", url: "https://abodesalm.github.io/restaurant" },
    action2: {
      label: "GitHub",
      url: "https://github.com/abodesalm/restaurant",
    },
  },
  {
    title: "Coffee shop website",
    desc: "A landing page for a coffee office supply service. Features service listings, FAQ accordion, and a contact section. Clean single-page layout with smooth anchor navigation.",
    date: "2024-06",
    cover: "/img/coffee/cover.png",
    type: "web",
    tags: ["NextJS", "SASS", "TypeScript", "TailwindCSS", "Plain"],
    action1: { label: "Live", url: "https://abod-coffee.netlify.app/" },
    action2: { label: "GitHub", url: "https://github.com/abodesalm/coffee" },
  },
  {
    title: "Telcom website",
    desc: "An internal management system built for Telcom Internet Company. Shows the available internet packs, and the contacts.",
    date: "2026-02",
    type: "web",
    cover: "/img/telcom/cover.png",
    tags: ["React", "TailwindCSS", "SASS", "Plain"],
    action1: { label: "Live", url: "https://tellcom.netlify.app/" },
    action2: null,
  },
  {
    title: "MYTE Company",
    desc: "Official website for Myte Team, a licensed Saudi digital services company. Showcases services including web development, mobile apps, design, and visual identity — with a projects portfolio and contact system.",
    date: "2023-09",
    cover: "/img/myte/cover.png",
    type: "web",
    tags: ["NextJS", "Plain", "SASS", "TailwindCSS"],
    action1: { label: "Live", url: "https://myteteam.netlify.app/" },
    action2: { label: "GitHub", url: "https://github.com/abodesalm/myte" },
  },
  {
    title: "Zed Games",
    desc: "A games discovery platform with user authentication, game listings, search by series/developer/publisher, and a 'game of the day' feature. Includes user profiles and a golden games section.",
    date: "2024-07",
    cover: "/img/zedgames/cover.png",
    type: "web",
    tags: ["NextJS", "Multilingual", "ExpressJS", "MongoDB", "TypeScript"],
    action1: { label: "Live", url: "https://zedgames.netlify.app/" },
    action2: { label: "GitHub", url: "https://github.com/abodesalm/new-zed" },
  },
  {
    title: "Greeting Cards Generator",
    desc: "A simple greeting card generator where users pick a card design, type their name, preview it live, and download the personalized card instantly.",
    date: "2026-03",
    cover: "/img/greeting-cards/cover.png",
    type: "web",
    tags: ["HTML", "CSS", "JavaScript"],
    action1: { label: "Live", url: "https://mubarakcards.netlify.app/" },
    action2: null,
  },
  {
    title: "Teachers Library",
    desc: "An educational platform for teachers featuring a digital library of school textbooks, quizzes, and study materials — built for the Saudi curriculum 1447.",
    date: "2025-12",
    cover: "/img/books/cover.png",
    type: "web",
    tags: ["NextJS", "ExpressJS", "MongoDB", "TailwindCSS", "TypeScript"],
    action1: { label: "Live", url: "https://sabir511.netlify.app/" },
    action2: { label: "GitHub", url: "https://github.com/abodesalm/bk" },
  },
  {
    title: "OQ system",
    desc: "A full admin dashboard for managing users, activation codes, tests and question banks. Includes analytics, revenue tracking, and data tables — built for the OQ Maker platform.",
    date: "2025-07",
    cover: "/img/oq/cover.png",
    type: "web",
    tags: ["Full-Stack", "Dashboard", "NextJS", "ExpressJS"],
    action1: { label: "Live", url: "https://oqmaker.com" },
    action2: { label: "GitHub", url: "https://github.com/abodesalm/oq-dash" },
  },
  {
    title: "NM System",
    desc: "Network Mamangement system is an internal system built for Telcom Internet Company to handle inventory, storage operations, and internet workflows.",
    date: "2025-10",
    cover: "/img/nm/cover.png",
    type: "web",
    tags: ["Full-Stack", "Dashboard", "NextJS", "ExpressJS"],
    action1: null,
    action2: {
      label: "GitHub",
      url: "https://github.com/abodesalm/telcom-dash",
    },
  },
  {
    title: "MC Sheets",
    desc: "A bilingual (Arabic/English) cheat sheet reference tool — clean, minimal, and fast.",
    date: "2023-3",
    cover: "/img/mc/cover.png",
    type: "web",
    tags: ["HTML", "CSS", "JavaScript"],
    action1: { label: "Live", url: "https://abodesalm.github.io/mc" },
    action2: { label: "GitHub", url: "https://github.com/abodesalm/mc" },
  },
  {
    title: "Jedda Uni Login",
    desc: "A login page for Jedda university in KSA",
    date: "2026-1",
    cover: "/img/jedda-login/cover.png",
    type: "web",
    tags: ["Multilingual", "HTML", "CSS", "JavaScript"],
    action1: null,
    action2: null,
  },
];

/*

*/

export const certs: Certificate[] = [
  { title: "Basic Education Certificate", score: "98%", date: "2022" },
  {
    title: "High School Certificate",
    score: "91%",
    date: "2025",
  },
  {
    title: "Faculty of Dentistry - ASPU",
    score: "First Year",
    date: "2025",
  },
];

export const reviews: Review[] = [
  {
    name: "Ahmed A.",
    content: "م.عبدالرحمن وخدماته مميزه",
    link: "https://khamsat.com/user/ahmed-alnabulsi",
  },
  {
    name: "Fuad N.",
    content: "جيد",
    link: "https://khamsat.com/user/fuadnassar90",
  },
  {
    name: "محمد ص.",
    content: "تسلم يمناك يا مبدع",
    link: "https://khamsat.com/user/mmm5123",
  },
  {
    name: "محمد ص.",
    content:
      "هذا الرجل كلفه بالعمل ولا تخاف لانه راح يقدم لك عمل يفوق ماتتمناه — جزيل الشكر والتقدير",
    link: "https://khamsat.com/user/mmm5123",
  },
  {
    name: "محمد ص.",
    content:
      "جزيل الشكر والتقدير يا رائع يا مميز، كلمات الشكر لم ولن توفيك حقك، إنسان أمين صادق ما يلف ولا يدور. سرعة، تميز، إنجاز. الله يوفقك وينور طريقك.",
    link: "https://khamsat.com/user/mmm5123",
  },
  {
    name: "Sidra R.",
    content: "سريع ومحترف ومتعاون",
    link: "https://khamsat.com/user/sidra2024",
  },
];

export const socialLinks: link[] = [
  {
    title: "WhatsApp",
    url: "https://wa.me/963997203291",
    icon: <FaWhatsapp />,
  },
  {
    title: "Instagram",
    url: "https://www.instagram.com/3bod.design",
    icon: <FaInstagram />,
  },
  {
    title: "Facebook",
    url: "https://www.facebook.com/3abod.sa",
    icon: <FaFacebook />,
  },
  { title: "Telegram", url: "https://t.me/abodsa6", icon: <FaTelegram /> },
  {
    title: "LinkedIn",
    url: "https://linkedin.com/in/3bod-sa",
    icon: <FaLinkedin />,
  },
  { title: "Github", url: "https://github.com/abodesalm", icon: <FaGithub /> },
  {
    title: "Discord",
    url: "https://discord.com/users/1070269889983557692",
    icon: <FaDiscord />,
  },
  {
    title: "Steam",
    url: "https://steamcommunity.com/id/3bod_sa/",
    icon: <FaSteam />,
  },
  { title: "Website", url: "https://3bod.sy", icon: <FaGlobe /> },
];

export const info = {
  name: "Abdurrahman Assalim",
  shortname: "3bod Sa",
  birth: "2006-12-13",
  address: "Damascus",
  email: "abodesalm45@gmail.com",
  number: "0997 203 291",
  summary:
    "I craft fast, clean web experiences — from pixel-perfect UIs to scalable back-ends. Based in Damascus , building things that matter.",
  hobbies: ["football", "pixel art", "video games", ""],
  cv_link: "/my-cv.pdf",
  hero_sentence:
    "Web developer & Graphic designer based in Damascus. Building clean, fast, and memorable digital experiences.",
};

export const { main_api } = api;
