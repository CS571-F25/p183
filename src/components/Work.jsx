import { useState, useMemo } from "react";
import { Container } from "react-bootstrap";
import ProjectCard from "./ProjectCard.jsx";
import RoleFilter from "./RoleFilter.jsx";
import reactLogo from "../assets/react.svg";

/**
 * Work items with role focus tags
 * roleFocus can be: 'data-science', 'ui-ux', or both (array)
 */
const workItems = [
  {
    title: "Wisconsin Conservation Voices – Voter Engagement Platform",
    role: "Cohort Manager & UX Designer · Spring 2024",
    timeframe: "Spring 2024",
    description:
      "Led a small cohort working with Wisconsin Conservation Voices to design a digital tool that helps residents learn about climate policy and track small behavior changes. Coordinated usability research, synthesized interview insights, and helped design Figma prototypes for a behavior-change dashboard and resource hub.",
    tags: ["UI/UX", "HCI", "Team Project"],
    roleFocus: ["ui-ux"],
    imageSrc: reactLogo,
    imageAlt: "Wisconsin Conservation Voices voter engagement platform",
    externalLink: "https://example.org/wcv-slides",
  },
  {
    title: "Safety Insights Clinical Dashboards",
    role: "Data Science Intern · LAVIS Research Informatics",
    timeframe: "Summer 2025",
    description:
      "Built Tableau dashboards to visualize adverse events across clinical trials, helping pharma stakeholders monitor safety signals. Created interactive visualizations that enable real-time monitoring of safety data across multiple studies, supporting data-driven decision making in drug development.",
    tags: ["Data Science", "Tableau", "Clinical Data", "Data Visualization"],
    roleFocus: ["data-science"],
    imageSrc: reactLogo,
    imageAlt: "Safety insights dashboards",
  },
  {
    title: "Spectacle Health – Plan Guide Chatbot",
    role: "Research Fellow · 7-week R&D project",
    timeframe: "Spring 2025",
    description:
      "Built an AI-powered chatbot prototype that helps older adults compare Medicare and Marketplace plans. Used vector databases and embeddings to answer natural language questions about coverage and costs. Focused on making complex insurance information more approachable.",
    tags: ["Data Science", "GenAI", "UI/UX"],
    roleFocus: ["data-science", "ui-ux"],
    imageSrc: reactLogo,
    imageAlt: "Spectacle Health plan guide chatbot",
    externalLink: "https://example.org/spectacle-health",
  },
  {
    title: "Communal Gratitude Research",
    role: "Research Intern · Tech4Good Lab, UCSC",
    timeframe: "Spring 2025",
    description:
      "Co-authored a research paper on communal gratitude in online communities, doing thematic analysis on data from a gratitude app. Conducted qualitative analysis to identify patterns in how people express and experience gratitude in digital spaces, contributing to HCI research on positive computing.",
    tags: ["HCI Research", "Qualitative Analysis", "Thematic Analysis", "Research"],
    roleFocus: ["ui-ux"],
    externalLink: "https://dl.acm.org/doi/10.1145/3710972",
    imageSrc: reactLogo,
    imageAlt: "Communal gratitude research",
  },
  {
    title: "Biokind Analytics Data Dashboards",
    role: "Data Analyst · Biokind Analytics",
    timeframe: "2024-2025",
    description:
      "Work with public data APIs and dashboards to benchmark Dane County against peer counties, creating visualizations that help identify trends and opportunities in public health and county-level data. Built interactive dashboards that support evidence-based decision making for public health initiatives.",
    tags: ["Data Science", "Public Health", "County Data", "Data Analysis"],
    roleFocus: ["data-science"],
    imageSrc: reactLogo,
    imageAlt: "Biokind analytics dashboards",
  },
  {
    title: "Personal Portfolio Website",
    role: "Personal Project",
    timeframe: "Fall 2025",
    description:
      "Designed and developed this responsive personal website using React, React Router, and React Bootstrap. Focused on creating an accessible, mobile-friendly experience with dark/light theme support, interactive components, and real-time Spotify integration.",
    tags: ["React", "React Router", "React Bootstrap", "Accessibility", "UI/UX"],
    roleFocus: ["ui-ux"],
    imageSrc: reactLogo,
    imageAlt: "Portfolio website",
  },
];

/**
 * Work - Portfolio page showing projects and experiences
 * Supports filtering by role focus (Data Science vs UI/UX)
 */
export default function Work() {
  const [selectedRole, setSelectedRole] = useState("all");

  // Filter work items based on selected role
  const filteredItems = useMemo(() => {
    if (selectedRole === "all") {
      return workItems;
    }

    return workItems.filter((item) => {
      const roleFocus = item.roleFocus || [];
      return roleFocus.includes(selectedRole);
    });
  }, [selectedRole]);

  return (
    <main>
      <Container className="py-5">
        <header className="mb-4">
          <h1>Work</h1>
          <p className="lead">
            A collection of projects and experiences spanning data science, human-computer interaction,
            and accessible design. Filter by focus to explore specific areas.
          </p>
        </header>

      <RoleFilter selectedRole={selectedRole} onRoleChange={setSelectedRole} />

      <section aria-label="Work projects and experiences">
        {filteredItems.length > 0 ? (
          <div>
            {filteredItems.map((item) => (
              <ProjectCard 
                key={item.title} 
                title={item.title}
                role={item.role}
                timeframe={item.timeframe}
                description={item.description}
                tags={item.tags}
                externalLink={item.externalLink}
                imageSrc={item.imageSrc}
                imageAlt={item.imageAlt}
              />
            ))}
          </div>
        ) : (
          <p className="text-muted">No projects found for the selected filter.</p>
        )}
      </section>
      </Container>
    </main>
  );
}