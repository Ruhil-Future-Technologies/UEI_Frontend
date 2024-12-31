import React from "react";

const TeacherGraoh=()=>{
    return(
        <div className="col-xl-5 d-flex align-items-stretch">
        <div className="row w-100">
            <div className="col-lg-6">
                <div className="card w-100 rounded-4">
                    <div className="card-body">


                        <div className="chart-container2">
                            <div id="chart1"></div>
                        </div>
                        <div className="text-center">
                            <p className="mb-0 ">Addmission Rate</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-lg-6">
                <div className="card w-100 rounded-4">
                    <div className="card-body">


                        <div className="chart-container2">
                            <div id="chart4"></div>
                        </div>
                        <div className="text-center">
                            <p className="mb-0 ">Syllabus Coverage</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-lg-6">
                <div className="card w-100 rounded-4">
                    <div className="card-body">


                        <div className="chart-container2">
                            <div id="chart3"></div>
                        </div>
                        <div className="text-center">
                            <p className="mb-0 ">Fee Collection</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    )

}

export default TeacherGraoh;