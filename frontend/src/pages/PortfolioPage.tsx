import React, { useEffect, useState } from 'react';
import { FiArrowUpRight, FiGithub, FiImage, FiTrash2, FiUploadCloud } from 'react-icons/fi';
import GlassPanel from '../components/GlassPanel';

const portfolioImageStorageKey = 'gg-strategy:portfolio-project-images';

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
  const [projectImages, setProjectImages] = useState<Record<string, string>>({});
  const [imageMessage, setImageMessage] = useState('');

  useEffect(() => {
    try {
      const savedImages = localStorage.getItem(portfolioImageStorageKey);
      if (savedImages) setProjectImages(JSON.parse(savedImages) as Record<string, string>);
    } catch {
      setImageMessage('Saved project images could not be read in this browser.');
    }
  }, []);

  const handleImageUpload = async (projectTitle: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setImageMessage('Choose an image file to add a project preview.');
      input.value = '';
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setImageMessage('Choose an image smaller than 15 MB.');
      input.value = '';
      return;
    }

    try {
      const imageData = await new Promise<string>((resolve, reject) => {
        const objectUrl = URL.createObjectURL(file);
        const image = new Image();
        image.onload = () => {
          const maxWidth = 1280;
          const scale = Math.min(1, maxWidth / image.width);
          const canvas = document.createElement('canvas');
          canvas.width = Math.max(1, Math.round(image.width * scale));
          canvas.height = Math.max(1, Math.round(image.height * scale));
          const context = canvas.getContext('2d');
          if (!context) {
            URL.revokeObjectURL(objectUrl);
            reject(new Error('Image processing is unavailable.'));
            return;
          }
          try {
            context.drawImage(image, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL('image/jpeg', 0.78));
          } catch {
            reject(new Error('Image processing failed.'));
          } finally {
            URL.revokeObjectURL(objectUrl);
          }
        };
        image.onerror = () => {
          URL.revokeObjectURL(objectUrl);
          reject(new Error('Image could not be opened.'));
        };
        image.src = objectUrl;
      });

      const nextImages = { ...projectImages, [projectTitle]: imageData };
      localStorage.setItem(portfolioImageStorageKey, JSON.stringify(nextImages));
      setProjectImages(nextImages);
      setImageMessage(`${projectTitle} image saved in this browser.`);
    } catch {
      setImageMessage('The image could not be saved. Try a smaller image.');
    } finally {
      input.value = '';
    }
  };

  const removeImage = (projectTitle: string) => {
    const nextImages = { ...projectImages };
    delete nextImages[projectTitle];
    try {
      localStorage.setItem(portfolioImageStorageKey, JSON.stringify(nextImages));
      setProjectImages(nextImages);
      setImageMessage(`${projectTitle} image removed.`);
    } catch {
      setImageMessage('The image could not be removed in this browser.');
    }
  };

  return (
    <div className="portfolio-page feature-page px-4 py-7 sm:px-6 lg:px-8">
      <header className="feature-heading portfolio-heading mb-6">
        <div>
          <p className="feature-eyebrow"><FiGithub /> Selected work</p>
          <h1>Portfolio</h1>
          <p className="feature-heading-copy">A collection of projects, tools, and ideas brought to life.</p>
        </div>
      </header>

      {imageMessage && <p className="portfolio-image-message" aria-live="polite">{imageMessage}</p>}

      <div className="portfolio-grid">
        {projects.map((project) => (
          <GlassPanel key={project.title} className="portfolio-project-card">
            <div className={`portfolio-project-visual${projectImages[project.title] ? ' has-image' : ''}`}>
              {projectImages[project.title] ? (
                <img src={projectImages[project.title]} alt={`${project.title} project preview`} />
              ) : (
                <div className="portfolio-project-placeholder"><FiImage /><span>Project preview</span></div>
              )}
              <div className="portfolio-image-actions">
                <label className="portfolio-image-upload">
                  <FiUploadCloud />
                  {projectImages[project.title] ? 'Change image' : 'Add image'}
                  <input type="file" accept="image/*" aria-label={`Add an image for ${project.title}`} onChange={(event) => void handleImageUpload(project.title, event)} />
                </label>
                {projectImages[project.title] && (
                  <button type="button" onClick={() => removeImage(project.title)} className="portfolio-image-remove" aria-label={`Remove image for ${project.title}`}><FiTrash2 /></button>
                )}
              </div>
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
    </div>
  );
};

export default PortfolioPage;
