import React from 'react';
import { Link } from 'react-router-dom';

export const Assignments = () => {
  return (
    <div className="main-wrapper">
      assignments page
      <li>
        <Link to="/teacher-dashboard/create-assignment">
          <div className="menu-title">Create Assignments</div>
        </Link>
      </li>
    </div>
  );
};
