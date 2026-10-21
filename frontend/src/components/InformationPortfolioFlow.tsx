import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import InformationPage from '../pages/InformationPage';
import PortfolioPage from '../pages/PortfolioPage';

const InformationPortfolioFlow: React.FC = () => {
  const { pathname } = useLocation();
  const informationSectionRef = useRef<HTMLDivElement>(null);
  const portfolioSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = pathname === '/portfolio' ? portfolioSectionRef.current : informationSectionRef.current;
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
    target?.scrollIntoView({ behavior, block: 'start' });
  }, [pathname]);

  return (
    <div className="information-portfolio-flow">
      <div ref={informationSectionRef} className="information-flow-page">
        <InformationPage />
      </div>
      <div ref={portfolioSectionRef} className="portfolio-flow-page">
        <PortfolioPage />
      </div>
    </div>
  );
};

export default InformationPortfolioFlow;
