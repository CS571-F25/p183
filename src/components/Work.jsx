import { Container } from "react-bootstrap";
import ProjectCard from "./ProjectCard.jsx";

const workItems = [
  {
    title: "Portfolio Website",
    role: "Personal Project",
    timeframe: "Fall 2025",
    description:
      "insert description here",
    tags: ["tag", "tag", "tag"],
  },
  {
    title: "Example",
    role: "Student Developer",
    timeframe: "Summer 2025",
    description:
      "insert description here",
    tags: ["tag", "tag"],
  },
];

export default function Work() {
  return (
    <Container className="py-5">
      <h1 className="mb-4">Work</h1>
      <p className="mb-4">
        A few projects and experiences that represent what I’ve been working on.
      </p>
      {workItems.map((item) => (
        <ProjectCard key={item.title} {...item} />
      ))}
    </Container>
  );
}