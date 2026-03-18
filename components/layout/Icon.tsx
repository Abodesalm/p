// ─── Skill icons ────────────────────────────────────────────────────────────
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
  BsPeople,
  BsPeopleFill,
  BsTable,
  BsArrowLeft,
  BsArrowRight,
} from "react-icons/bs";

// ─── Social / link icons ─────────────────────────────────────────────────────
import {
  FaWhatsapp,
  FaInstagram,
  FaFacebook,
  FaTelegram,
  FaLinkedin,
  FaGithub,
  FaDiscord,
  FaSteam,
  FaGlobe,
} from "react-icons/fa";

// ─── UI / layout icons ───────────────────────────────────────────────────────
import {
  BiCalendarEvent,
  BiCodeAlt,
  BiCrop,
  BiJoystick,
  BiPackage,
  BiStar,
  BiStore,
  BiStats,
} from "react-icons/bi";
import { FaHouseChimney, FaPhone } from "react-icons/fa6";
import { MdArrowDropDown, MdEmail } from "react-icons/md";
import { TbHierarchy2 } from "react-icons/tb";
import {
  RiBookmark2Line,
  RiDeleteBin5Line,
  RiDiscordFill,
  RiEdit2Line,
  RiExternalLinkLine,
  RiFacebookFill,
  RiHomeFill,
  RiHomeLine,
  RiInformationLine,
  RiInstagramFill,
  RiMenuFill,
  RiMenuLine,
  RiNewspaperFill,
  RiNewspaperLine,
  RiSearchFill,
  RiSearchLine,
  RiSettings5Fill,
  RiSteamFill,
} from "react-icons/ri";
import { PiSignOut } from "react-icons/pi";
import { IoDocuments } from "react-icons/io5";

// ─────────────────────────────────────────────────────────────────────────────

interface IconProps {
  i: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function Icon({ i, className = "", style }: IconProps) {
  const p = { className, style };

  // ── Skill icons ─────────────────────────────────────────────────
  if (i === "html") return <SiHtml5 {...p} />;
  else if (i === "css") return <SiCss3 {...p} />;
  else if (i === "js") return <SiJavascript {...p} />;
  else if (i === "ts") return <SiTypescript {...p} />;
  else if (i === "reactjs") return <SiReact {...p} />;
  else if (i === "nextjs") return <SiNextdotjs {...p} />;
  else if (i === "redux") return <SiRedux {...p} />;
  else if (i === "express") return <SiExpress {...p} />;
  else if (i === "tailwind") return <SiTailwindcss {...p} />;
  else if (i === "sass") return <SiSass {...p} />;
  else if (i === "shadcn") return <RxComponent2 {...p} />;
  else if (i === "mongodb") return <SiMongodb {...p} />;
  else if (i === "redis") return <SiRedis {...p} />;
  else if (i === "axios") return <SiAxios {...p} />;
  else if (i === "kotlin") return <SiKotlin {...p} />;
  else if (i === "blender") return <SiBlender {...p} />;
  else if (i === "illustrator") return <SiAdobeillustrator {...p} />;
  else if (i === "davinci") return <BsFilm {...p} />;
  else if (i === "git") return <SiGit {...p} />;
  else if (i === "py") return <SiPython {...p} />;
  else if (i === "linux") return <SiLinux {...p} />;
  else if (i === "servers") return <BsServer {...p} />;
  else if (i === "hardware") return <BsCpuFill {...p} />;
  else if (i === "erd") return <BsDiagram3Fill {...p} />;
  else if (i === "ccna") return <BsWifi {...p} />;
  else if (i === "msoffice") return <BsFiles {...p} />;
  // Language icons — text-based flags
  else if (i === "Ar")
    return (
      <span
        className={className}
        style={{ fontWeight: 700, fontSize: "0.9em", ...style }}
      >
        AR
      </span>
    );
  else if (i === "En")
    return (
      <span
        className={className}
        style={{ fontWeight: 700, fontSize: "0.9em", ...style }}
      >
        EN
      </span>
    );
  else if (i === "Ge")
    return (
      <span
        className={className}
        style={{ fontWeight: 700, fontSize: "0.9em", ...style }}
      >
        DE
      </span>
    );
  else if (i === "Fr")
    return (
      <span
        className={className}
        style={{ fontWeight: 700, fontSize: "0.9em", ...style }}
      >
        FR
      </span>
    );
  else if (i === "Sp")
    return (
      <span
        className={className}
        style={{ fontWeight: 700, fontSize: "0.9em", ...style }}
      >
        ES
      </span>
    );
  // ── Social / link icons ─────────────────────────────────────────
  else if (i === "whatsapp") return <FaWhatsapp {...p} />;
  else if (i === "instagram") return <FaInstagram {...p} />;
  else if (i === "facebook") return <FaFacebook {...p} />;
  else if (i === "telegram") return <FaTelegram {...p} />;
  else if (i === "linkedin") return <FaLinkedin {...p} />;
  else if (i === "github") return <FaGithub {...p} />;
  else if (i === "discord") return <FaDiscord {...p} />;
  else if (i === "steam") return <FaSteam {...p} />;
  else if (i === "website") return <FaGlobe {...p} />;
  // ── UI / navigation icons ───────────────────────────────────────
  else if (i === "home") return <RiHomeLine {...p} />;
  else if (i === "home-fill") return <RiHomeFill {...p} />;
  else if (i === "search") return <RiSearchLine {...p} />;
  else if (i === "search-fill") return <RiSearchFill {...p} />;
  else if (i === "news") return <RiNewspaperLine {...p} />;
  else if (i === "news-fill") return <RiNewspaperFill {...p} />;
  else if (i === "others") return <RiMenuLine {...p} />;
  else if (i === "others-fill") return <RiMenuFill {...p} />;
  else if (i === "users") return <BsPeople {...p} />;
  else if (i === "users-fill") return <BsPeopleFill {...p} />;
  else if (i === "games") return <BiJoystick {...p} />;
  else if (i === "series") return <BiPackage {...p} />;
  else if (i === "developer") return <BiCodeAlt {...p} />;
  else if (i === "publisher") return <BiStore {...p} />;
  else if (i === "golden") return <BiStar {...p} />;
  else if (i === "about") return <RiInformationLine {...p} />;
  else if (i === "normal-form") return <BsFiles {...p} />;
  else if (i === "table-form") return <BsTable {...p} />;
  else if (i === "remove") return <RiDeleteBin5Line {...p} />;
  else if (i === "toLink") return <RiExternalLinkLine {...p} />;
  else if (i === "edit") return <RiEdit2Line {...p} />;
  else if (i === "wishlist") return <RiBookmark2Line {...p} />;
  else if (i === "birth") return <BiCalendarEvent {...p} />;
  else if (i === "address") return <FaHouseChimney {...p} />;
  else if (i === "phone") return <FaPhone {...p} />;
  else if (i === "email") return <MdEmail {...p} />;
  else if (i === "departments") return <TbHierarchy2 {...p} />;
  else if (i === "stats") return <BiStats {...p} />;
  else if (i === "signout") return <PiSignOut {...p} />;
  else if (i === "downArrow") return <MdArrowDropDown {...p} />;
  else if (i === "rightArrow") return <BsArrowRight {...p} />;
  else if (i === "leftArrow") return <BsArrowLeft {...p} />;
  else if (i === "processor") return <BiCrop {...p} />;
  else if (i === "docs") return <IoDocuments {...p} />;
  else if (i === "settingsFill") return <RiSettings5Fill {...p} />;
  else if (i === "salaries")
    return (
      <span className={className} style={style}>
        $
      </span>
    );

  // ── Fallback ─────────────────────────────────────────────────────
  return (
    <span className={className} style={style}>
      ?
    </span>
  );
}
