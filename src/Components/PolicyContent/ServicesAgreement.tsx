import React from 'react';
import { useNavigate } from 'react-router-dom';
import gLogo from '../../assets/img/logo-white.svg';
import Footer from '../Footer';

export const getUrl=()=>{
   const token = localStorage.getItem("token");
  const usertype = localStorage.getItem("user_type");
  let logo_url = "";
  if (token) {
    if (usertype == "student" || usertype == "admin") {
      logo_url = "/main/Dashboard";
    } else if (usertype == "teacher") {
      logo_url = "/teacher-dashboard";
    } else if (usertype == "institute") {
      logo_url = "institute-dashboard"
    }
  } else {
    logo_url = "/";
  }
  return logo_url;
}
const ServicesAgreement = () => {
  const navigate = useNavigate();
  return (
    <div className="footermargin">
      <div className="main-wrapper pt-0 ms-0">
        <div className="main-content">
          <div className="page-breadcrumb d-flex flex-wrap gap-4 align-items-center mb-3 border-bottom pb-3 mb-5 ">
            <a href={getUrl()} className="fw-bold text-dark fs-4 me-4">
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
                      End User Agreement
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
                  <h1 className="fw-bold mb-4">End User Services Agreement</h1>
                  <p className="opacity-75">Last updated: February 15, 2024</p>
                  <p>
                    By accessing or using the Gyansetu Platform
                    (&quot;Platform&quot;), operated by Ruhil Future
                    Technologies, you agree to the following terms and
                    conditions.
                  </p>
                  <h6 className="fw-bold mt-5">
                    Understanding the Gyansetu Platform
                  </h6>
                  <p>By using Gyansetu, you acknowledge and understand that:</p>
                  <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem' }}>
                    <li>
                      The Platform provides syllabus-aligned, personalized
                      educational content for students. Gyansetu enables
                      interactive visual learning, teacher-guided voice
                      integration, and performance tracking for students,
                      teachers, and parents.
                    </li>
                    <li>
                      The Platform continuously evolves to enhance digital
                      learning experiences.
                    </li>
                    <li>
                      Gyansetu does not guarantee specific academic results, as
                      learning outcomes depend on student engagement and effort.
                    </li>
                  </ul>

                  <h6 className="fw-bold mt-5">
                    Digital Subscription &amp; Payments
                  </h6>
                  <p>
                    Access to Gyansetu may be free or paid, depending on the
                    features selected. Subscription payments, where applicable,
                    grant non-transferable, time-limited access to the Platform.
                    All payments are final, and no refunds will be issued once
                    access to digital content is provided.
                  </p>

                  <h6 className="fw-bold mb-2 mt-5">
                    Acceptable Use &amp; Restrictions
                  </h6>
                  <p>
                    Users must adhere to ethical and legal usage of the
                    Platform. You agree not to:
                    <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem' }}>
                      <li>
                        Copy.
                      </li>
                      <li>
                        distribute.
                      </li>
                      <li>
                        or resell
                        Gyansetu’s learning materials without permission.
                      </li>
                      <li>
                        Use the Platform for unauthorized commercial purposes.
                      </li>
                      <li>
                        Share login
                        credentials or allow unauthorized access to your account.
                      </li>
                      <li>
                        Engage in activities that disrupt platform operations, such
                        as hacking or excessive automated requests.
                      </li>
                    </ul>


                  </p>
                  <h6 className="fw-bold mb-2 mt-5">
                    Ownership &amp; Content Rights
                  </h6>
                  <p>
                    Gyansetu owns all educational content, branding, and
                    platform features. Users receive limited, personal access
                    and may not modify, reproduce, or redistribute content. Any
                    feedback or suggestions provided to Gyansetu may be used
                    without compensation to improve the Platform.
                  </p>

                  <h6 className="fw-bold mb-2 mt-5">
                    Indemnification
                  </h6>
                  <p>
                    You agree to indemnify and hold Gyansetu, Ruhil Future Technologies, and its employees harmless from any claims, damages, losses, or liabilities arising from your use of the platform. This includes, but is not limited to:
                  </p>
                  <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem' }}>
                    <li>Misuse of the Platform or violation of this Agreement.</li>
                    <li>Unauthorized distribution of content or breach of intellectual property rights.</li>
                    <li>Technical issues caused by your hardware, software, or internet connectivity.</li>
                  </ul>
                  <h6 className="fw-bold mb-2 mt-5">Limitation of Liability</h6>
                  <p>
                    Gyansetu shall not be responsible for loss of academic
                    performance, data corruption, service interruptions, or
                    financial loss arising from platform use. In no event shall
                    Gyansetu’s liability exceed the total amount paid for the
                    service (if applicable).
                  </p>
                  <h6 className="fw-bold mb-2 mt-5">Force Majeure</h6>
                  <p>
                    Gyansetu shall not be held liable for service disruptions
                    caused by:

                    <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem' }}>
                      <li>Natural disasters,</li>
                      <li>cyberattacks, power failures,</li>
                      <li>or third-party service outages,</li>
                      <li>Unforeseen regulatory changes
                        affecting digital education platforms,</li>
                      <li>
                        Technical issues
                        beyond reasonable control,
                      </li>
                      <li>In such cases, efforts will be
                        made to restore services as soon as possible</li>
                    </ul>

                  </p>
                  <h6 className="fw-bold mb-2 mt-5">
                    Governing Law &amp; Dispute Resolution
                  </h6>
                  <p>
                    This Agreement is governed by the laws of Haryana, India.
                    Any disputes shall be settled exclusively in the courts of
                    Haryana, India. If any clause in this Agreement is found
                    unenforceable, the remaining terms shall still apply.
                  </p>
                </div>

                <div id="list-item-4">
                  <h6 className="fw-bold mt-5">Contact Us</h6>
                  <p>For inquiries regarding this Agreement, contact:</p>
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
                      rel="noreferrer"
                      target="_blank"
                    >
                      www.ruhilholdings.com
                    </a>
                    <br />
                    By continuing to use Gyansetu, you acknowledge and agree to
                    this End User Services Agreement.
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

export default ServicesAgreement;
