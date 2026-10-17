import React, { useEffect, useState } from 'react';
import { FaFacebookF, FaGithub, FaLinkedinIn } from 'react-icons/fa';
import { FiArrowUpRight, FiCheck, FiCopy, FiEdit2, FiGlobe, FiMail, FiMapPin, FiPhone, FiUser } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../lib/axios';
import { authService, PersonalInformation } from '../services/api';

type SocialKey = 'linkedin' | 'facebook' | 'github';
type SocialProfile = Record<SocialKey, string>;

const emptyProfiles: SocialProfile = { linkedin: '', facebook: '', github: '' };
const socialPlatforms = [
  { key: 'linkedin', title: 'LinkedIn', hint: 'Professional profile', icon: FaLinkedinIn },
  { key: 'facebook', title: 'Facebook', hint: 'Social profile', icon: FaFacebookF },
  { key: 'github', title: 'GitHub', hint: 'Code and projects', icon: FaGithub },
] as const;

const profileStorageKey = (userId: number) => `gg-strategy:social-profiles:${userId}`;

const isWebAddress = (value: string): boolean => {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
};

const InformationPage: React.FC = () => {
  const { user } = useAuth();
  const [information, setInformation] = useState<PersonalInformation | null>(null);
  const [profiles, setProfiles] = useState<SocialProfile>(emptyProfiles);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<SocialKey | null>(null);
  const [draft, setDraft] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let cancelled = false;

    const loadInformation = async () => {
      setLoading(true);
      try {
        const result = await authService.getPersonalInformation();
        if (!cancelled) {
          setInformation(result);
          setError('');
        }
      } catch (requestError) {
        if (!cancelled) setError(getErrorMessage(requestError, 'Unable to load information.'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadInformation();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    try {
      const saved = localStorage.getItem(profileStorageKey(user.id));
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<SocialProfile>;
        setProfiles({ ...emptyProfiles, ...parsed });
      }
    } catch {
      setNotice('Saved social links could not be read in this browser.');
    }
  }, [user?.id]);

  const startEditing = (key: SocialKey) => {
    setEditing(key);
    setDraft(profiles[key]);
    setNotice('');
  };

  const saveProfile = (key: SocialKey) => {
    const value = draft.trim();
    if (value && !isWebAddress(value)) {
      setNotice('Enter a valid http or https profile URL.');
      return;
    }

    const nextProfiles = { ...profiles, [key]: value };
    setProfiles(nextProfiles);
    setEditing(null);
    setNotice(value ? 'Profile link saved in this browser.' : 'Profile link removed.');

    if (user?.id) {
      try {
        localStorage.setItem(profileStorageKey(user.id), JSON.stringify(nextProfiles));
      } catch {
        setNotice('This browser could not save the profile link.');
      }
    }
  };

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

  const openProfile = (value: string) => {
    if (isWebAddress(value)) window.open(value, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="feature-page information-page px-4 py-7 sm:px-6 lg:px-8">
      <header className="feature-heading mb-7">
        <div>
          <p className="feature-eyebrow"><FiUser /> Information</p>
          <h1>My Information</h1>
          <p className="feature-heading-copy">A private overview of personal details and profile links.</p>
        </div>
      </header>

      {loading ? (
        <section className="information-access-card" role="status">Loading personal information…</section>
      ) : error ? (
        <section className="information-access-card information-access-card--error" role="alert">
          <span className="information-access-icon"><FiUser /></span>
          <h2>Information is private</h2>
          <p>{error.includes('owner') ? 'These personal details are only available to the account that owns them.' : error}</p>
        </section>
      ) : information ? (
        <>
          <section className="information-profile-card">
            <div className="information-profile-glow" aria-hidden="true" />
            <div className="information-avatar" aria-hidden="true">{information.firstName.charAt(0)}{information.lastName.charAt(0)}</div>
            <div className="information-profile-copy">
              <p className="information-overline">Personal profile</p>
              <h2>{information.firstName} {information.lastName}</h2>
              <p>Contact details and profile links for this account.</p>
            </div>
            <span className="information-profile-badge"><FiCheck /> Owner profile</span>
          </section>

          <section className="information-section" aria-labelledby="personal-details-title">
            <div className="information-section-heading">
              <div>
                <p className="feature-eyebrow"><FiUser /> Profile details</p>
                <h2 id="personal-details-title">Personal details</h2>
              </div>
              <p>Provided account information</p>
            </div>

            <div className="information-details-grid">
              <article className="information-detail-card">
                <span className="information-detail-icon"><FiUser /></span>
                <div><span>First name</span><strong>{information.firstName}</strong></div>
              </article>
              <article className="information-detail-card">
                <span className="information-detail-icon"><FiUser /></span>
                <div><span>Last name</span><strong>{information.lastName}</strong></div>
              </article>
              <article className="information-detail-card">
                <span className="information-detail-icon"><FiPhone /></span>
                <div><span>Phone number</span><strong>{information.phone}</strong></div>
                <button type="button" onClick={() => void copyValue(information.phone, 'Phone number')} aria-label="Copy phone number"><FiCopy /></button>
              </article>
              <article className="information-detail-card">
                <span className="information-detail-icon"><FiMail /></span>
                <div><span>Email address</span><strong>{information.email}</strong></div>
                <button type="button" onClick={() => void copyValue(information.email, 'Email address')} aria-label="Copy email address"><FiCopy /></button>
              </article>
              <article className="information-detail-card information-detail-card--wide">
                <span className="information-detail-icon"><FiMapPin /></span>
                <div><span>Location</span><strong>{information.location}</strong></div>
              </article>
            </div>
          </section>

          <section className="information-section" aria-labelledby="social-profiles-title">
            <div className="information-section-heading">
              <div>
                <p className="feature-eyebrow"><FiGlobe /> Social media</p>
                <h2 id="social-profiles-title">Social profiles</h2>
              </div>
              <p>Links stay in this browser and are scoped to your account.</p>
            </div>

            <div className="social-profile-grid">
              {socialPlatforms.map((platform) => {
                const Icon = platform.icon;
                const value = profiles[platform.key];
                const isEditing = editing === platform.key;

                return (
                  <article className="social-profile-card" key={platform.key}>
                    <div className={`social-profile-icon social-profile-icon--${platform.key}`}><Icon /></div>
                    <div className="social-profile-content">
                      <div className="social-profile-heading"><div><h3>{platform.title}</h3><p>{platform.hint}</p></div>
                        {!isEditing && <button type="button" className="social-edit-button" onClick={() => startEditing(platform.key)} aria-label={`${value ? 'Edit' : 'Add'} ${platform.title} link`}><FiEdit2 /></button>}
                      </div>

                      {isEditing ? (
                        <div className="social-edit-form">
                          <label className="sr-only" htmlFor={`profile-${platform.key}`}>{platform.title} profile URL</label>
                          <input id={`profile-${platform.key}`} type="url" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="https://…" className="feature-input" />
                          <div className="social-edit-actions">
                            <button type="button" onClick={() => saveProfile(platform.key)} className="feature-button feature-button--small">Save link</button>
                            <button type="button" onClick={() => setEditing(null)} className="feature-button feature-button--quiet">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className={`social-profile-address ${value ? '' : 'is-empty'}`}>{value || 'No profile link added yet'}</p>
                          <div className="social-profile-actions">
                            {value ? (
                              <>
                                <button type="button" onClick={() => openProfile(value)} className="social-action-link">Open profile <FiArrowUpRight /></button>
                                <button type="button" onClick={() => void copyValue(value, `${platform.title} link`)} className="social-copy-button" aria-label={`Copy ${platform.title} link`}><FiCopy /></button>
                              </>
                            ) : <button type="button" onClick={() => startEditing(platform.key)} className="social-action-link">Add profile link <FiArrowUpRight /></button>}
                          </div>
                        </>
                      )}
                    </div>
                  </article>
                );
              })}

              <article className="social-profile-card social-profile-card--email">
                <div className="social-profile-icon social-profile-icon--email"><FiMail /></div>
                <div className="social-profile-content">
                  <div className="social-profile-heading"><div><h3>Email</h3><p>Direct contact</p></div></div>
                  <p className="social-profile-address">{information.email}</p>
                  <div className="social-profile-actions">
                    <a href={`mailto:${information.email}`} className="social-action-link">Write email <FiArrowUpRight /></a>
                    <button type="button" onClick={() => void copyValue(information.email, 'Email address')} className="social-copy-button" aria-label="Copy email address"><FiCopy /></button>
                  </div>
                </div>
              </article>
            </div>
            {notice && <p className="information-notice" aria-live="polite">{notice}</p>}
          </section>
        </>
      ) : null}
    </div>
  );
};

export default InformationPage;
