import React from 'react';
import { useNavigate } from 'react-router-dom';
import gLogo from '../../assets/img/logo-white.svg';
import Footer from '../Footer';
//import { List, ListItem } from '@mui/material';
//import { BackArrowCircle } from '../../assets';
//import { Box } from '@mui/material';
const PrivacyPolicy = () => {
  const navigate = useNavigate();
  return (
    <div className="footermargin">
      <div className="main-wrapper pt-0 ms-0">
        <div className="main-content">
          <div className="page-breadcrumb d-flex flex-wrap gap-4 align-items-center mb-3 border-bottom pb-3 mb-5">
            <a href="/" className="fw-bold text-dark fs-4 me-4">
              <img src={gLogo} width={20} className="me-1 " alt="" /> Gyansetu
            </a>
            <div className="d-flex">
              <div className="cursor-pointer" onClick={() => navigate(-1)}>
                <i className="bi bi-arrow-left-circle-fill fs-5 me-2"></i>
              </div>
              <div className="breadcrumb-title pe-3">Site Policies</div>
              <div className="ps-3">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb mb-0 p-0">
                    <li className="breadcrumb-item">
                      <a href="/" className="text-secondary">
                        <i className="bi bi-house-fill"></i>
                      </a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Privacy Policy
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>

          <div className="container">
            <div className="row">
              <div className="col-12">
                <div id="list-item-1" className="mb-5">
                  <h1 className="fw-bold mb-4">Privacy Policy</h1>
                  <p className="opacity-75 mb-4">
                    Last updated: February 15, 2024
                  </p>
                  <p className="mb-5">
                    This Privacy Policy applies to all Personal Information
                    collected by Gyansetu, operated by Ruhil Future
                    Technologies, through its platform, website, and associated
                    services.
                  </p>

                  <h6 className="fw-bold">Personal Information</h6>
                  <p className="mb-5">
                    Gyansetu is committed to safeguarding user privacy. We
                    collect and use personal data responsibly to enhance the
                    learning experience while ensuring transparency and control
                    over your information. Unless otherwise authorized, Gyansetu
                    will only collect and use personal information as outlined
                    below.
                  </p>

                  <h6 className="fw-bold mb-2">Collection of Information</h6>
                  <p>
                    Gyansetu may collect personal information in the following
                    ways:
                  </p>
                  <ul>
                    <li>
                      When you register on the Gyansetu Platform (website,
                      mobile app, or integrated services).
                    </li>
                    <li>
                      When you engage with platform features, such as
                      syllabusaligned learning, performance tracking, or
                      interactive content.
                    </li>
                    <li>
                      When you contact us via Email, Phone, or Online Support.
                    </li>
                    <li>
                      When you participate in surveys, feedback sessions, or
                      training workshops.
                    </li>
                    <li>
                      When schools, parents, or teachers provide necessary
                      student details to customize educational services.
                    </li>
                    <li>
                      Through thirdparty integrations, such as Google Analytics,
                      for platform improvements.
                    </li>
                  </ul>
                </div>

                <div id="list-item-2">
                  <h6 className="fw-bold mb-2">
                    Types of Information Collected
                  </h6>
                  <p>
                    Gyansetu may collect the following types of information:
                  </p>
                  <ul>
                    <li>
                      <strong> Personal Details </strong> : Name, Address,
                      Email, Phone Number, Age, School Details.
                    </li>
                    <li>
                      <strong> Educational Data </strong> : Subject preferences,
                      learning progress, test scores, and interaction history.
                    </li>
                    <li>
                      <strong> Technical Data </strong> : IP Address, Device
                      Information, Browser Type, Cookies, and Log Data.
                    </li>
                    <li>
                      <strong> Transactional Data </strong> : Purchase history
                      (for premium features) and billing details where
                      applicable.
                    </li>
                  </ul>

                  <h6 className="fw-bold mt-5">
                    Why We Collect Your Information
                  </h6>
                  <p>Gyansetu collects personal data to:</p>
                  <ul>
                    <li>
                      Deliver and improve educational content tailored to
                      individual learning needs.
                    </li>
                    <li>
                      Enhance user experience by personalizing platform
                      recommendations.
                    </li>
                    <li>
                      Track student progress and provide performance insights
                      for teachers and parents.
                    </li>
                    <li>Provide customer support and technical assistance.</li>
                    <li>
                      Send service updates and important notifications (e.g.,
                      syllabus changes, new features).
                    </li>
                    <li>Improve the platform using analytics and feedback.</li>
                  </ul>
                  <p>
                    Gyansetu does not sell, rent, or share user information with
                    third parties for marketing purposes.
                  </p>
                </div>

                <div id="list-item-3">
                  <h6 className="fw-bold mt-5">Communications</h6>
                  <p>We may use your information to:</p>
                  <ul>
                    <li>
                      Send educational updates, progress reports, or support
                      messages.
                    </li>
                    <li>
                      Provide important service announcements and security
                      alerts.
                    </li>
                    <li>
                      Offer marketing communications (only with user consent).
                    </li>
                  </ul>
                  <p>Users can opt out of marketing emails at any time.</p>
                </div>

                <div id="list-item-4">
                  <h6 className="fw-bold mt-5">Log Data &amp; Cookies</h6>
                  <ul>
                    <li>
                      Like many digital platforms, Gyansetu collects Log Data
                      and Cookies for performance monitoring and usability
                      improvements.
                    </li>
                    <li>
                      Log Data includes IP addresses, browser details, and page
                      interactions.
                    </li>
                    <li>
                      Cookies help personalize content and enhance user
                      experience.
                    </li>
                    <li>
                      Users may modify browser settings to manage cookie
                      preferences, but disabling cookies may impact platform
                      functionality.
                    </li>
                  </ul>

                  <h6 className="fw-bold mt-5">
                    Storage &amp; Security of Your Personal Information
                  </h6>
                  <p>Gyansetu prioritizes data security and implements:</p>
                  <ul>
                    <li>
                      Encryption and Secure Storage: User data is encrypted and
                      stored securely.
                    </li>
                    <li>
                      Restricted Access: Only authorized personnel can access
                      sensitive data.
                    </li>
                    <li>
                      Regular Audits: Security policies are reviewed
                      periodically for compliance.
                    </li>
                  </ul>
                  <p>
                    While we strive for industry standard protection, no online
                    platform is 100% secure, and users should take precautions
                    when sharing personal data.
                  </p>

                  <h6 className="fw-bold mt-5">Future Changes</h6>
                  <p>
                    Gyansetu reserves the right to update this Privacy Policy as
                    new features or services are introduced. Users will be
                    notified of any significant changes via email or platform
                    notifications.
                  </p>
                  <h6 className="fw-bold mt-5">Contact Us</h6>
                  <p>
                    For inquiries or concerns regarding this Privacy Policy,
                    please contact us:
                  </p>
                  <p>
                    Phone: <a href="tel:9992636653">+91 9992636653</a> <br />
                    Email:{' '}
                    <a href="mailto:info@ruhilholdings.com">
                      info@ruhilholdings.com
                    </a>
                    <br />
                    Website:{' '}
                    <a
                      href="https://www.ruhilholdings.com"
                      target="_blank"
                      rel="noreferrer"
                    >
                      www.ruhilholdings.com
                    </a>
                    <br />
                    By using Gyansetu, you acknowledge and agree to this Privacy
                    Policy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
