import React from "react";
import { Link } from "react-router-dom";

const StudentAssignments = () => {
    return (
        <>
            <div className="main-wrapper">
                <div className="main-content">
                    <h1>list of my assignment </h1>
                   <Link to={'/main/student/view-and-submit'}> click to view and submit </Link>
                </div>
            </div>
        </>
    )
}


export default StudentAssignments;