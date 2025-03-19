import React from 'react';

const RefundPolicy = () => {
  return (
    <div className="main-wrapper">
      <div className="main-content">
        <div className="page-breadcrumb d-none d-sm-flex align-items-center mb-3 border-bottom pb-3 mb-5">
          <div className="breadcrumb-title pe-3">Site Policies</div>
          <div className="ps-3">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0 p-0">
                <li className="breadcrumb-item">
                  <a href="javascript:;">
                    <i className="bx bx-home-alt"></i>
                  </a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Refund Policy
                </li>
              </ol>
            </nav>
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
                  Gyansetu is committed to delivering high quality educational
                  content and services. Since our platform offers digital
                  learning solutions, we generally do not offer refunds once
                  access has been granted or services have been used.
                </p>
                <p>
                  However, cancellations and refunds may be considered under the
                  following conditions:
                </p>
                <ul>
                  <li>
                    If a subscription or paid service is canceled within 24
                    hours of purchase and access has not been granted, a refund
                    may be processed.
                  </li>
                  <li>
                    Refund requests must be made via email within the allowed
                    timeframe.
                  </li>
                </ul>

                <h6 className="fw-bold mt-5">Refund Process</h6>
                <p>To request a refund, users must:</p>
                <p>
                  Send an email to info@ruhilholdings.com with the subject
                  &quot;Refund Request&quot; and include order details. The
                  request will be reviewed, and users will be notified of
                  approval or rejection. post approval, refunds will be
                  initiated after deducting 20% of the payment for processing
                  and administrative charges.
                </p>
                <p>
                  If the refund has not been received within the expected time,
                  users should contact their bank or card issuer for further
                  details.
                </p>

                <h6 className="fw-bold mb-2 mt-5">NonRefundable Services</h6>
                <p>The following services are not eligible for refunds:</p>
                <ul>
                  <li>
                    Digital courses or content that has already been accessed.
                  </li>
                  <li>Subscription fees after 24 hours of purchase.</li>
                  <li>Payments for onetime consultations or workshops.</li>
                </ul>
              </div>

              <div id="list-item-4">
                <h6 className="fw-bold mt-5">Contact Us</h6>
                <p>For refund related questions, please contact:</p>
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
  );
};

export default RefundPolicy;
