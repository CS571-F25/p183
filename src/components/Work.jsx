import { Container } from "react-bootstrap";
import ProjectCard from "./ProjectCard.jsx";

export default function Work() { 
  return (
    <Container className="py-5">
      <h1 className="mb-4">Work</h1>
      {/*placeholder*/}
      <p>Here are a few things I’ve worked on recently.</p>
      <ProjectCard
        title="Portfolio Website"
        description="This site – built with React, React Router, and React Bootstrap."
      />
    </Container>
  );
}