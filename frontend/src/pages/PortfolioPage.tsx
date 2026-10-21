import React from 'react';
import { FiArrowUpRight, FiGithub, FiImage } from 'react-icons/fi';
import GlassPanel from '../components/GlassPanel';
import ubtFindPointImage from '../assets/ubt-findpoint.png';
import freelancerMarketplaceImage from '../assets/freelancer-marketplace.png';
/*




 *
 * import ubtFindPointImage from '../assets/ubt-findpoint.png';
 * import freelancerMarketplaceImage from '../assets/freelancer-marketplace.png';
 * import journeySyncImage from '../assets/journeysync.png';
 * import smartHospitalImage from '../assets/smart-hospital.png';
 * import restaurantSystemImage from '../assets/restaurant-system.png';
 * import unitedStadiumImage from '../assets/united-stadium-seat-selection.png';
 * import courseClickerImage from '../assets/course-clicker.png';
 */

interface PortfolioProject {
  title: string;
  description: string;
  technologies: string[];
  date: string;
  github: string;
  image: string | undefined;
}

const projects: PortfolioProject[] = [
  {
    title: 'UBT-FindPoint',
    description: 'A web application that allows users to find points of interest and navigate through them using an interactive map interface. Created by - Group Project',
    technologies: ['React', 'Node.js', 'MySQL'],
    date: '2026',
    github: 'https://github.com/ertihoxha5/UBT-FindPoint',
    image: ubtFindPointImage,
  },
  {
    title: 'Freelancer-MarketPlace',
    description: 'A web application that connects freelancers with clients, allowing them to showcase their skills, find projects, and collaborate effectively. Created by - Group Project',
    technologies: ['React', 'Node.js', 'MySQL'],
    date: '2026',
    github: 'https://github.com/ertihoxha5/Freelancer-MarketPlace',
    image: freelancerMarketplaceImage,
  },
  {
    title: 'JourneySync',
    description: 'A web application that helps users plan and synchronize their journeys, providing features for itinerary management, travel recommendations, and collaborative trip planning. Created by - Group Project',
    technologies: ['Nextjs', 'Node.js', 'MongoDB'],
    date: '2026',
    github: 'https://github.com/ertihoxha5/JourneySync',
    image: undefined, // Set to journeySyncImage after adding its import above.
  },
  {
    title: 'SmartHospital-System',
    description: 'A web application that streamlines hospital operations, providing features for patient management, appointment scheduling, and medical record keeping. Created by - Group Project',
    technologies: ['React', 'Node.js', 'MySQL'],
    date: '2025',
    github: 'https://github.com/ertihoxha5/SmartHospital-System',
    image: undefined, // Set to smartHospitalImage after adding its import above.
  },
  {
    title: 'RestaurantSystem',
    description: 'A web application for managing restaurant operations, including menu management, order processing, and inventory control. Created by - Group Project',
    technologies: ['React', 'Node.js', 'MySQL'],
    date: '2025',
    github: 'https://github.com/ertihoxha5/RestaurantSystem',
    image: undefined, // Set to restaurantSystemImage after adding its import above.
  },
  {
    title: 'unitedStadiumSeatSelection',
    description: 'This project is a web application for ticket management in a football stadium. It was created with passion and creativity by the developer. Created by - ð“–ð“®ð“½.',
    technologies: ['React', 'ASP.NET Core Web API', 'MySQL'],
    date: '2025',
    github: 'https://github.com/Getuar333/united',
    image: undefined, // Set to unitedStadiumImage after adding its import above.
  },
  {
    title: 'Course Clicker',
    description: 'This project is a web application for Manage course and literature per college.',
    technologies: ['HTML5', 'CSS', 'JavaScript', 'PHP'],
    date: '2024',
    github: 'https://github.com/rDiti/Web-Projekti',
    image: undefined, // Set to courseClickerImage after adding its import above.
  },
];

const projectSections = Array.from({ length: Math.ceil(projects.length / 2) }, (_, index) =>
  projects.slice(index * 2, index * 2 + 2),
);

const PortfolioPage: React.FC = () => (
  <div className="portfolio-page feature-page px-4 py-7 sm:px-6 lg:px-8">
    {projectSections.map((sectionProjects, index) => (
      <section
        key={sectionProjects[0].title}
        id={index === 0 ? 'portfolio-start' : undefined}
        className="page-snap-section portfolio-snap-section"
        aria-label={`Portfolio projects ${index * 2 + 1} to ${index * 2 + sectionProjects.length}`}
      >
        {index === 0 && (
          <header className="feature-heading portfolio-heading mb-6">
            <div>
              <p className="feature-eyebrow"><FiGithub /> Selected work</p>
              <h1>Portfolio</h1>
              <p className="feature-heading-copy">A collection of projects, tools, and ideas brought to life.</p>
            </div>
          </header>
        )}

        <div className="portfolio-grid">
          {sectionProjects.map((project) => (
            <GlassPanel key={project.title} className="portfolio-project-card">
              <div className={`portfolio-project-visual${project.image ? ' has-image' : ''}`}>
                {project.image ? (
                  <img src={project.image} alt={`${project.title} project preview`} />
                ) : (
                  <div className="portfolio-project-placeholder"><FiImage /><span>Image not added</span></div>
                )}
              </div>
              <div className="portfolio-project-copy">
                <div className="portfolio-project-title-row"><h2>{project.title}</h2><span>{project.date}</span></div>
                <p className="portfolio-project-description">{project.description}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => <span key={tech} className="portfolio-tech-chip">{tech}</span>)}
              </div>
              <a href={project.github} target="_blank" rel="noreferrer" className="portfolio-repository-link"><FiGithub /> View repository <FiArrowUpRight /></a>
            </GlassPanel>
          ))}
        </div>
      </section>
    ))}
  </div>
);

export default PortfolioPage;
