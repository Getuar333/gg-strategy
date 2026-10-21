import React, { useState } from 'react';
import { FaFacebook, FaGithub, FaLinkedinIn } from 'react-icons/fa';
import { FiArrowUpRight, FiAward, FiChevronDown, FiCopy, FiDownload, FiMail, FiMapPin, FiPhone, FiUser } from 'react-icons/fi';
import profilePhoto from '../assets/profile-photo.JPG?url';
import cvDocument from '../assets/CV.pdf?url';
import ubtCertificate from '../assets/GLOBAL UBT FEST 2025.pdf?url';
import mindlusterCertificate from '../assets/Mindluster_Certificate.pdf?url';

const personalInformation = {
  firstName: 'Getuar',
  lastName: 'Gashi',
  phone: '+383 45 367137',
  email: 'getuat.gaming@gmail.com',
  location: 'Lipjan, Sllovi 14000.',
};
const socialUrls = {
  linkedin: 'https://www.linkedin.com/in/getuar-gashi-5490b4336/',
  facebook: 'https://www.facebook.com/getuar.gashi.94801',
  github: 'https://github.com/Getuar333',
};

const socialProfiles = [
  { key: 'linkedin', title: 'LinkedIn', hint: 'Professional network', url: socialUrls.linkedin, icon: FaLinkedinIn },
  { key: 'facebook', title: 'Facebook', hint: 'Social profile', url: socialUrls.facebook, icon: FaFacebook },
  { key: 'github', title: 'GitHub', hint: 'Code and projects', url: socialUrls.github, icon: FaGithub },
  { key: 'email', title: 'Email', hint: 'Get in touch', url: `mailto:${personalInformation.email}`, icon: FiMail },
];

const InformationPage: React.FC = () => {
  const [notice, setNotice] = useState('');
  const [profilePhotoUnavailable, setProfilePhotoUnavailable] = useState(false);
  const fullName = `${personalInformation.firstName} ${personalInformation.lastName}`;

  const copyValue = async (value: string, label: string) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        const temporaryInput = document.createElement('textarea');
        temporaryInput.value = value;
        temporaryInput.setAttribute('readonly', '');
        temporaryInput.style.position = 'fixed';
        temporaryInput.style.opacity = '0';
        document.body.appendChild(temporaryInput);
        temporaryInput.select();
        document.execCommand('copy');
        temporaryInput.remove();
      }
      setNotice(`${label} copied.`);
    } catch {
      setNotice('Copy is unavailable in this browser.');
    }
  };

  return (
    <div className="feature-page information-page px-4 py-7 sm:px-6 lg:px-8">
      <section className="page-snap-section information-intro-section" aria-label="Profile introduction">
        <header className="feature-heading mb-7">
          <div>
            <p className="feature-eyebrow"><FiUser />My Information</p>
          </div>
        </header>

        <section className="information-profile-card" aria-label="Personal profile">
        <div className="information-profile-glow" aria-hidden="true" />
        <div className="information-avatar">
          {!profilePhotoUnavailable ? (
            <img src={profilePhoto} alt={`${fullName} profile`} onError={() => setProfilePhotoUnavailable(true)} />
          ) : (
            <span aria-hidden="true">GG</span>
          )}
        </div>
        <div className="information-profile-copy">
          <p className="information-overline">Profile</p>
          <h2>{fullName}</h2>
          <p>Based in {personalInformation.location}</p>
        </div>
        <details className="information-certificates">
          <summary className="information-profile-cv" title="Shkarko certifikatat">
            <FiAward aria-hidden="true" />
            <span>Certifikatat</span>
            <FiChevronDown className="information-certificates-chevron" aria-hidden="true" />
          </summary>
          <div className="information-certificates-menu">
            <a href={ubtCertificate} download="GLOBAL UBT FEST 2025.pdf">
              <span>GLOBAL UBT FEST 2025</span>
              <FiDownload aria-hidden="true" />
            </a>
            <a href={mindlusterCertificate} download="Mindluster_Certificate.pdf">
              <span>Mindluster Certificate</span>
              <FiDownload aria-hidden="true" />
            </a>
          </div>
        </details>
        <a className="information-profile-cv" href={cvDocument} download="CV.pdf" title="Shkarko CV-në">
          <span className="information-profile-cv-mark">CV</span>
          <span>Shkarko CV</span>
          <FiDownload aria-hidden="true" />
        </a>
        </section>
      </section>

      <section className="information-section page-snap-section" aria-labelledby="personal-details-title">
        <div className="information-section-heading">
          <div>
            <h2 id="personal-details-title">Details</h2>
          </div>
          <p>Information contacted on this platform</p>
        </div>

        <div className="information-details-grid">
          <article className="information-detail-card">
            <span className="information-detail-icon"><FiUser /></span>
            <div><span>Emri</span><strong>{personalInformation.firstName}</strong></div>
          </article>
          <article className="information-detail-card">
            <span className="information-detail-icon"><FiUser /></span>
            <div><span>Mbiemri</span><strong>{personalInformation.lastName}</strong></div>
          </article>
          <article className="information-detail-card">
            <span className="information-detail-icon"><FiPhone /></span>
            <div><span>Numri i telefonit</span><strong>{personalInformation.phone}</strong></div>
            <button type="button" onClick={() => void copyValue(personalInformation.phone, 'Phone number')} aria-label="Copy phone number"><FiCopy /></button>
          </article>
          <article className="information-detail-card">
            <span className="information-detail-icon"><FiMail /></span>
            <div><span>Email-i</span><strong>{personalInformation.email}</strong></div>
            <button type="button" onClick={() => void copyValue(personalInformation.email, 'Email address')} aria-label="Copy email address"><FiCopy /></button>
          </article>
          <article className="information-detail-card information-detail-card--wide">
            <span className="information-detail-icon"><FiMapPin /></span>
            <div><span>Lokacioni</span><strong>{personalInformation.location}</strong></div>
          </article>
        </div>
      </section>

      <section className="information-section information-social-section page-snap-section" aria-labelledby="social-profiles-title">
        <div className="information-section-heading">
          <div>
            <h2 id="social-profiles-title">Mediat sociale</h2>
          </div>
          <p>Choose a platform to connect</p>
        </div>

        <div className="information-social-links">
          {socialProfiles.map((profile) => {
            const Icon = profile.icon;
            const isConfigured = profile.url.length > 0;
            return (
              <a
                key={profile.key}
                href={isConfigured ? profile.url : undefined}
                target={profile.key === 'email' ? undefined : '_blank'}
                rel={profile.key === 'email' ? undefined : 'noreferrer'}
                aria-disabled={!isConfigured}
                className={`information-social-link information-social-link--${profile.key}${isConfigured ? '' : ' is-unconfigured'}`}
                onClick={(event) => {
                  if (!isConfigured) {
                    event.preventDefault();
                    setNotice(`Add the ${profile.title} URL in InformationPage.tsx to activate this link.`);
                  }
                }}
              >
                <span className="information-social-icon"><Icon /></span>
                <span className="information-social-copy"><strong>{profile.title}</strong><small>{isConfigured ? profile.hint : 'Add profile URL in code'}</small></span>
                <FiArrowUpRight className="information-social-arrow" />
              </a>
            );
          })}
        </div>
        {notice && <p className="information-notice" aria-live="polite">{notice}</p>}
      </section>
    </div>
  );
};

export default InformationPage;
