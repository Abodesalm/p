import Link from "next/link";

export default function Button({
  children = <></> || "",
  style = "normal",
  className = "",
  action = () => {},
  link = false,
  external = false,
  url = "",
}) {
  const styling = (type) => {
    if (type === "normal") return " btn-normal ";
    else if (type === "prime") return " btn-prime ";
    else if (type === "danger") return " btn-danger ";
    else if (type === "success") return " btn-success ";
    else if (type === "outline") return " btn-outline ";
    else if (type === "outline-prime") return " btn-outline-prime ";
    else if (type === "outline-danger") return " btn-outline-danger ";
    else if (type === "outline-success") return " btn-outline-success ";
    else if (type === "ui") return " btn-ui ";
    else if (type === "ui-blur") return " btn-ui-blur ";
    else if (type === "ui-radio") return " btn-ui-radio ";
  };

  return link ? (
    <Link
      href={url}
      className={styling(style) + className}
      target={external ? "_blank" : "_self"}
    >
      {children}
    </Link>
  ) : (
    <button onClick={action} className={styling(style) + className}>
      {children}
    </button>
  );
}
