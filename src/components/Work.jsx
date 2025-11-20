import { Container } from "react-bootstrap";
import ProjectCard from "./ProjectCard.jsx";

const workItems = [
  {
    title: "Portfolio Website",
    role: "Personal project",
    timeframe: "Fall 2025",
    description:
      "...",
    tags: ["tag", "tag", "tag"]
  },
  {
    title: "Example Position",
    role: "...",
    timeframe: "Summer 2025",
    description:
      "...",
    tags: ["tag", "tag"]
  }
];

export default function Work() {
  return (
    <Container className="py-5">
      <h1 className="mb-4">Work</h1>
      {workItems.map((item) => (
        <WorkItem key={item.title} {...item} />
      ))}
    </Container>
  );
}