export default interface Project {
  title: string;
  desc: string;
  date: string;
  cover: string;
  type: string;
  tags: string[];
  action1: { label: string; url: string } | null;
  action2: { label: string; url: string } | null;
}
