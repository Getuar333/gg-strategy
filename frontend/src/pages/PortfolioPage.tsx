import React from 'react';
import { FiGithub } from 'react-icons/fi';
import GlassPanel from '../components/GlassPanel';

const projects = [
  {
    title: 'UBT-FindPoint',
    description: 'A web application that allows users to find points of interest and navigate through them using an interactive map interface. Created by - Group Project',
    technologies: ['React', 'Node.js', 'MySQL'],
    date: '2026',
    github: 'https://github.com/ertihoxha5/UBT-FindPoint',
  },
  {
    title: 'Freelancer-MarketPlace',
    description: 'A web application that connects freelancers with clients, allowing them to showcase their skills, find projects, and collaborate effectively. Created by - Group Project',
    technologies: ['React', 'Node.js', 'MySQL'],
    date: '2026',
    github: 'https://github.com/ertihoxha5/Freelancer-MarketPlace',
  },
  {
    title: 'JourneySync',
    description: 'A web application that helps users plan and synchronize their journeys, providing features for itinerary management, travel recommendations, and collaborative trip planning. Created by - Group Project',
    technologies: ['Nextjs', 'Node.js', 'MongoDB'],
    date: '2026',
    github: 'https://github.com/ertihoxha5/JourneySync',
  },
  {
    title: 'SmartHospital-System',
    description: 'A web application that streamlines hospital operations, providing features for patient management, appointment scheduling, and medical record keeping. Created by - Group Project',
    technologies: ['React', 'Node.js', 'MySQL'],
    date: '2025',
    github: 'https://github.com/ertihoxha5/SmartHospital-System',
  },
  {
    title: 'RestaurantSystem',
    description: 'A web application for managing restaurant operations, including menu management, order processing, and inventory control. Created by - Group Project',
    technologies: ['React', 'Node.js', 'MySQL'],
    date: '2025',
    github: 'https://github.com/ertihoxha5/RestaurantSystem',
  },
  {
    title: 'unitedStadiumSeatSelection',
    description: 'This project is a web application for ticket management in a football stadium. It was created with passion and creativity by the developer. Created by - 𝓖𝓮𝓽.',
    technologies: ['React', 'ASP.NET Core Web API', 'MySQL'],
    date: '2025',
    github: 'https://github.com/Getuar333/united',
  },
  {
    title: 'Course Clicker',
    description: 'This project is a web application for Manage course and literature per college.',
    technologies: ['HTML5', 'CSS', 'JavaScript', 'PHP'],
    date: '2024',
    github: 'https://github.com/rDiti/Web-Projekti',
  },
  //Ho is next??
  
];
const PortfolioPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(255,80,80,0.18),_transparent_35%),linear-gradient(140deg,_#04060b_0%,_#0a1019_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <header className="mb-6">
        <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/70">Portfolio from Geti</p>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">This portfolio showcases the projects I have worked on over the years.</p>
      </header>
      <div className="grid gap-5 lg:grid-cols-2">
        {projects.map((project) => (
          <GlassPanel key={project.title} className="flex flex-col gap-4">
            <div className="h-36 rounded-2xl border border-white/10 bg-[linear-gradient(135deg,_rgba(255,120,72,0.25),_rgba(34,211,238,0.2))]" />
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-white">{project.title}</h2>
                <p className="mt-1 text-sm text-slate-400">{project.description}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span key={tech} className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-300">{tech}</span>
              ))}
            </div>
            <div className="flex items-center justify-between text-sm text-slate-400">
              <span>Created {project.date}</span>
              <div className="flex items-center gap-2">
                <a href={project.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-white"><FiGithub /> View Repository</a>
              </div>
            </div>
          </GlassPanel>
        ))}
      </div>
    </div>
  );
};

export default PortfolioPage;
