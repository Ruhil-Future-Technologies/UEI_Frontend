import React from 'react';
import { useNavigate } from 'react-router-dom';
import gLogo from '../../assets/img/logo-white.svg';
import Footer from '../Footer';

const RefundPolicy = () => {
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
                      Refund Policy
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
                  <h1 className="fw-bold mb-4">Refund Policy</h1>
                  <p className="opacity-75 mb-4">
                    Last updated: February 15, 2024
                  </p>
                  <h6 className="fw-bold">Cancellations &amp; Refunds</h6>
                  <p>
                    Gyansetu is committed to delivering high-quality educational
                    content and services. Since our platform offers digital
                    learning solutions, we generally do not offer refunds once
                    access has been granted or services have been used.
                  </p>
                  <p>
                    However, cancellations and refunds may be considered under
                    the following conditions:
                  </p>
                  <ul>
                    <li>
                      If a subscription or paid service is cancelled within 24
                      hours of purchase and access has not been granted, a
                      refund may be processed.
                    </li>
                    <li>
                      Refund requests must be made via email within the allowed
                      timeframe.
                    </li>
                  </ul>

                  <h6 className="fw-bold mt-5">Refund Process</h6>
                  <p>To request a refund, users must:</p>
                  <ol>
                    <li>
                      <b>Email Us: </b>
                      Send an email to info@ruhilholdings.com with the subject
                      &quot;Refund Request&quot; and include order details.
                    </li>
                    <li>
                      <b>Review and Notification: </b>
                      We&apos;ll review your request and notify you of approval or rejection.
                    </li>
                    <li>
                      <b>Refund Initiation: </b>
                      If approved, refunds will be initiated after deducting 20% of the payment for processing and administrative charges.
                    </li>
                    <li>
                      <b>Follow-up: </b>
                      If the refund has not been received within the expected
                      time, users should contact their bank or card issuer for
                      further details.
                    </li>
                  </ol>


                  <h6 className="fw-bold mb-2 mt-5">Non-Refundable Services</h6>
                  <p>The following services are not eligible for refunds:</p>
                  <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem' }}>
                    <li>
                      Digital courses or content that has already been accessed.
                    </li>
                    <li>Subscription fees after 24 hours of purchase.</li>
                    <li>Payments for one-time consultations or workshops.</li>
                  </ul>
                </div>

                <div id="list-item-4">
                  <h6 className="fw-bold mt-5">Contact Us</h6>
                  <p>For refund-related questions, please contact:</p>
                  <p>
                    Phone: <a href="tel:9992636653">+91 9992636653</a> <br />
                    Email:{' '}
                    <a href="mailto:info@ruhilholdings.com">
                      info@ruhilholdings.com
                    </a>
                    <br />
                    By using Gyansetu’s services, you acknowledge and agree to
                    this Refund Policy.
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

export default RefundPolicy;
