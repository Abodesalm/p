type XPType = "job" | "education";

export default interface XPItem {
  title: string;
  place: string;
  start: string;
  end: string;
  desc: string;
  type: XPType;
}
