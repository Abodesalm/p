import {
  BiCalendarEvent,
  BiCodeAlt,
  BiCrop,
  BiGame,
  BiJoystick,
  BiPackage,
  BiStar,
  BiStore,
} from "react-icons/bi";
import {
  BsArrowLeft,
  BsArrowRight,
  BsFiles,
  BsPeople,
  BsPeopleFill,
  BsTable,
} from "react-icons/bs";
import { FaHouseChimney, FaPhone } from "react-icons/fa6";
import { MdArrowDropDown, MdEmail } from "react-icons/md";
import { TbHierarchy2 } from "react-icons/tb";
import { BiStats } from "react-icons/bi";
import {
  RiBookmark2Line,
  RiDeleteBin5Line,
  RiDiscordFill,
  RiDiscordLine,
  RiEdit2Line,
  RiExternalLinkLine,
  RiFacebookFill,
  RiFacebookLine,
  RiHomeFill,
  RiHomeLine,
  RiInformationLine,
  RiInstagramFill,
  RiInstagramLine,
  RiMenuFill,
  RiMenuLine,
  RiNewspaperFill,
  RiNewspaperLine,
  RiSearchFill,
  RiSearchLine,
  RiSettings5Fill,
  RiSteamFill,
  RiSteamLine,
} from "react-icons/ri";
import { PiSignOut } from "react-icons/pi";
import { IoDocuments } from "react-icons/io5";

export default function Icon({ i, className = "" }) {
  if (i === "salaries") return "$";
  else if (i === "users") return <BsPeople className={className} />;
  else if (i === "users-fill") return <BsPeopleFill className={className} />;
  else if (i === "home") return <RiHomeLine className={className} />;
  else if (i === "home-fill") return <RiHomeFill className={className} />;
  else if (i === "search") return <RiSearchLine className={className} />;
  else if (i === "search-fill") return <RiSearchFill className={className} />;
  else if (i === "news") return <RiNewspaperLine className={className} />;
  else if (i === "news-fill") return <RiNewspaperFill className={className} />;
  else if (i === "others") return <RiMenuLine className={className} />;
  else if (i === "others-fill") return <RiMenuFill className={className} />;
  // ...
  else if (i === "games") return <BiJoystick className={className} />;
  else if (i === "series") return <BiPackage className={className} />;
  else if (i === "developer") return <BiCodeAlt className={className} />;
  else if (i === "publisher") return <BiStore className={className} />;
  else if (i === "golden") return <BiStar className={className} />;
  else if (i === "about") return <RiInformationLine className={className} />;
  // ...
  else if (i === "instagram") return <RiInstagramFill className={className} />;
  else if (i === "discord") return <RiDiscordFill className={className} />;
  else if (i === "steam") return <RiSteamFill className={className} />;
  else if (i === "facebook") return <RiFacebookFill className={className} />;
  // ...
  else if (i === "normal-form") return <BsFiles className={className} />;
  else if (i === "table-form") return <BsTable className={className} />;
  // ...
  else if (i === "remove") return <RiDeleteBin5Line className={className} />;
  else if (i === "toLink") return <RiExternalLinkLine className={className} />;
  else if (i === "edit") return <RiEdit2Line className={className} />;
  else if (i === "wishlist") return <RiBookmark2Line className={className} />;
  //
  else if (i === "birth") return <BiCalendarEvent className={className} />;
  else if (i === "address") return <FaHouseChimney className={className} />;
  else if (i === "phone") return <FaPhone className={className} />;
  else if (i === "email") return <MdEmail className={className} />;
  else if (i === "departments") return <TbHierarchy2 className={className} />;
  else if (i === "stats") return <BiStats className={className} />;
  else if (i === "signout") return <PiSignOut className={className} />;
  else if (i === "downArrow") return <MdArrowDropDown className={className} />;
  else if (i === "rightArrow") return <BsArrowRight className={className} />;
  else if (i === "leftArrow") return <BsArrowLeft className={className} />;
  else if (i === "processor") return <BiCrop className={className} />;
  else if (i === "docs") return <IoDocuments className={className} />;
  else if (i === "settingsFill")
    return <RiSettings5Fill className={className} />;
  // ...
  else if (i === "action") return <IoDocuments className={className} />;
  else if (i === "fps") return <IoDocuments className={className} />;
  else if (i === "open world") return <IoDocuments className={className} />;
  else if (i === "battle royal") return <IoDocuments className={className} />;
  else if (i === "rpg") return <IoDocuments className={className} />;
  else if (i === "stealth") return <IoDocuments className={className} />;
  else if (i === "endie") return <IoDocuments className={className} />;
  else if (i === "platform") return <IoDocuments className={className} />;
  else if (i === "survival") return <IoDocuments className={className} />;
  else if (i === "horror") return <IoDocuments className={className} />;
  else if (i === "adventure") return <IoDocuments className={className} />;
  else if (i === "simulation") return <IoDocuments className={className} />;
  else if (i === "puzzle") return <IoDocuments className={className} />;
  else if (i === "multiplayer") return <IoDocuments className={className} />;
  else if (i === "singleplayer") return <IoDocuments className={className} />;
  else if (i === "strategy") return <IoDocuments className={className} />;
  else if (i === "sports") return <IoDocuments className={className} />;
  else if (i === "racing") return <IoDocuments className={className} />;
  else if (i === "casual") return <IoDocuments className={className} />;
  else if (i === "fighting") return <IoDocuments className={className} />;
  else if (i === "cards") return <IoDocuments className={className} />;
  else if (i === "hack & slash") return <IoDocuments className={className} />;
  else if (i === "family-friendly")
    return <IoDocuments className={className} />;
}

// I use this component to save icons in the database as texts (string) and when i want to use it in the front end i translate it to Icon Element here
