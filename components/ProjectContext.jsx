"use client";
import { createContext, useState, useEffect } from "react";
// As soon as the website loads , it will fetch the all projects data from backend
// Create the context
const ProjectContext = createContext();

// Create the context provider component
export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState(null);
  // get the all projects data & store it in projects
  useEffect(() => {
    const fetchProjects = async () => {
      const res = await fetch("/api/posts");
      const data = await res.json();
      setProjects(data);
    };

    fetchProjects();
  }, []);
  const updateProjects = (newProjects) => {
    setProjects(newProjects);
  };

  return (
    <ProjectContext.Provider value={{ projects, updateProjects }}>
      {children}
    </ProjectContext.Provider>
  );
};

export default ProjectContext;
