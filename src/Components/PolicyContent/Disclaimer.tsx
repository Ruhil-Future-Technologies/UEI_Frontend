import React from 'react';
import { useNavigate } from 'react-router-dom';
//import Footer from '../Footer';
//import { List, ListItem } from '@mui/material';
import gLogo from '../../assets/img/logo-white.svg';
import Footer from '../Footer';

const Disclaimer = () => {
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
                      Disclaimer
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
                  <h1 className="fw-bold mb-4">Website Disclaimer</h1>
                  <p className="opacity-75 mb-4">
                    Last updated: February 15, 2024
                  </p>

                  <p>
                    The information provided on the Gyansetu Platform (including
                    [www.ruhilholdings.com] (https://www.ruhilholdings.com)) is
                    for general educational and informational purposes only.
                  </p>
                  <p>
                    While we strive to ensure that the content on this platform
                    is accurate, updated, and relevant, Gyansetu makes no
                    warranties—express or implied—regarding:
                  </p>
                  <ul>
                    <li>
                      The completeness, accuracy, reliability, or suitability of
                      the platform’s content.
                    </li>
                    <li>
                      The applicability of educational materials to specific
                      exam boards, curriculums, or individual learning needs.
                    </li>
                    <li>
                      The uninterrupted availability of services or platform
                      functionalities.
                    </li>
                  </ul>

                  <p>
                    Any reliance on the information provided by Gyansetu is
                    strictly at your own risk.
                  </p>
                  <h6 className="fw-bold mt-5">Limitation of Liability</h6>
                  <p>
                    In no event shall Gyansetu, Ruhil Future Technologies, or
                    its affiliates be liable for:
                  </p>

                  <ul>
                    <li>
                      Indirect, incidental, or consequential damages arising
                      from the use of this platform.
                    </li>
                    <li>
                      Loss of data, academic performance, or financial losses
                      due to platform reliance.
                    </li>
                    <li>
                      Service interruptions or platform downtime due to
                      technical issues beyond our control.
                    </li>
                  </ul>

                  <h6 className="fw-bold mt-5">Third Party Links</h6>
                  <p>
                    Gyansetu may include links to external websites or resources
                    for reference purposes. We do not endorse or control third
                    party content.
                  </p>
                  <p>
                    We are not responsible for the accuracy, reliability, or
                    availability of linked websites. Users should exercise
                    caution when accessing external links and review their
                    respective terms and policies.
                  </p>

                  <h6 className="fw-bold mb-2 mt-5">Service Availability</h6>
                  <p>
                    Every effort is made to keep the platform operational and
                    running smoothly. However, Gyansetu is not responsible for
                    technical issues that may cause:
                  </p>
                  <ul>
                    <li>Temporary unavailability of the platform.</li>
                    <li>
                      Service disruptions due to software updates, server
                      maintenance, or internet failures.
                    </li>
                  </ul>
                  <p>
                    By using Gyansetu, you acknowledge and agree to this Website
                    Disclaimer.
                  </p>
                </div>

                <div id="list-item-4">
                  <h6 className="fw-bold mt-5">Contact Us</h6>
                  <p>For any concerns regarding this disclaimer, contact:</p>
                  <p>
                    Email:{' '}
                    <a href="mailto:info@ruhilholdings.com">
                      info@ruhilholdings.com
                    </a>
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

export default Disclaimer;
