import React from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Link } from 'react-router-dom';

interface StatCardProps {
  to: string;
  icon: React.ReactNode;
  value: string | number;
  label: string;
  trend?: string;
  trendIcon?: React.ReactNode;
  textColor?: string;
}

const StatCard = ({ to, icon, value, label, trend = '+24%', trendIcon = <ExpandMoreIcon />, textColor = 'text-success' }: StatCardProps) => {
  return (
    <div className="col-6 col-lg-2 d-flex mb-2">
    <Link to={to} className="card w-100">
      <div className="card-body">
        <div className="mb-3 d-flex align-items-center justify-content-between">
          <div className="wh-42 d-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10 text-primary">
            {icon}
          </div>
          <div>
            <span className={`${textColor} d-flex align-items-center`}>
              {trend} {trendIcon}
            </span>
          </div>
        </div>
        <div>
          <h4 className="mb-0">{value}</h4>
          <p className="mb-0">{label}</p>
        </div>
      </div>
    </Link>
  </div>
  )
}

export default StatCard