import { Container } from "react-bootstrap";
import ProjectCard from "./ProjectCard.jsx";

const workItems = [
  {
    title: "Portfolio Website",
    role: "Personal Project",
    timeframe: "Fall 2025",
    description:
      "dummy text to show how a project description would look like",
    tags: ["tag", "tag", "tag"],
  },
  {
    title: "Example Role / Project",
    role: "Student Developer",
    timeframe: "Summer 2025",
    description:
      "Short description of something I worked on",
    tags: ["tag", "tag"],
  },
  {
    title: "Another Project",
    role: "Course or Club Project",
    timeframe: "2024",
    description:
      "more dummy text",
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