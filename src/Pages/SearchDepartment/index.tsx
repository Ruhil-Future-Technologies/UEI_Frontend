import React, { useEffect, useState } from 'react';
import './user.css';
import useApi from '../../hooks/useAPI';
import ModeRoundedIcon from '@mui/icons-material/ModeRounded';
import { useNavigate } from 'react-router-dom';

interface Department {
  department_name: string;
  is_active: string;
  created_by: string;
  created_at: string;
  lastModifiedBy: string;
  updated_at: string;
}

function User() {
  let departmentData1:Department[]=[];
  const navigat=useNavigate();
  const [departmentData, setDepartmentData] = useState<Department[]>(departmentData1);
  const [filtereddepartmentData, setfilteredDepartmentData] = useState<Department[]>(departmentData1);
  const { getData }=useApi();
  useEffect(() => {
    try {
      getData(`${'department/list'}`, true).then((data: any) => {
        console.log(data);
        if (data?.status === 200) {
          console.log("Data saved successfully !!");
          //departmentData1=;
          setDepartmentData(data.data);
          console.log(departmentData1);
        } else {
          console.log("Encountering some issue from API");
        }
      });
    } catch (error) {
      console.error(error);
    }
  }, []); // Empty dependency array ensures the effect runs only once when the component mounts
  
 

  

  //console.log(departmentData);
  const [filters, setFilters] = useState<{ departmentName: string; status: number }>({
    departmentName: '',
    status: 0
  });

  const handelChanges = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFilters(values => ({ ...values, [name]: value }));
  };

  const submithandeler = () => {
    console.log(filters);
 
    if (filters.departmentName.length > 2) {
    const filteredData = departmentData.filter(fdata => {
      console.log(fdata.is_active,filters.status);
      const managementNameMatch = filters.departmentName ? fdata.department_name.toLowerCase().includes(filters.departmentName.toLowerCase()) : false;
      const statusMatch = parseInt(fdata.is_active) === filters.status;
      if (managementNameMatch && statusMatch) {
        return managementNameMatch && statusMatch;
      } else if (managementNameMatch && !statusMatch) {
        return managementNameMatch;
      } else if (!managementNameMatch && statusMatch) {
        return statusMatch;
      }
      return false;
    });
    setfilteredDepartmentData(filteredData);
  }else if(filters.departmentName.length == 0){
    setfilteredDepartmentData(departmentData);
  }else{
    //empty
  }
  };

  useEffect(() => {
    if (filters.departmentName.length > 2) {
      submithandeler();
    }
   else if(filters.departmentName.length == 0) {
    submithandeler();
    }else{
      //empty
    }
  }, [filters.departmentName]); 
  const deparmentDtails = (data: any) => {
    const productId = data.id;
    navigat(`/department/edit/${productId}`);
  };
// console.log(filtereddepartmentData);
  return (
    <>
      <div className="container" style={{ paddingBottom: '20px' }}>
        <form onSubmit={submithandeler}>
          <div className="row-10 d-flex justify-content-end">
            <div className="col-4">
              <label>Department Name</label>
              <input
                className="form-control"
                type="text"
                name="departmentName"
                value={filters.departmentName || ''}
                onChange={handelChanges}
                autoFocus={false}
              />
            </div>
          </div>
        </form>
      </div>
      
      <div className="container">
        <div className="card">
          <div className="card-header">
            <div className="row">
              <div className="col-2"><span>Department Name</span></div>
              <div className="col-1"><span>Status</span></div>
              <div className="col-2"><span>Created By</span></div>
              <div className="col-2"><span>Created date and time</span></div>
              <div className="col-2"><span>Last Modified By</span></div>
              <div className="col-2"><span>Modified data and time</span></div>
              <div className="col-1"><span>Edit</span></div>
            </div>
          </div>
         
          {(filtereddepartmentData.length>0?filtereddepartmentData:departmentData).map((depdata, index) => (
            <div key={index} className="card-body">
              <div className="row">
                <div className="col-2">
                  <input type="text" className="form-control" placeholder="Enter Feature" value={depdata.department_name} readOnly />
                </div>
                <div className="col-1">
                  <input type="text" className="form-control" name="status" value={(parseInt(depdata.is_active))==1?"Active":"incative"} readOnly />
                </div>
                <div className="col-2">
                  <input type="text" className="form-control" placeholder="Created By" value={depdata.created_by} readOnly />
                </div>
                <div className="col-2">
                  <input type="text" className="form-control" placeholder="Creted date and time" value={depdata.created_at} readOnly />
                </div>
                <div className="col-2">
                  <input type="text" className="form-control" placeholder="Last Updated By" value={depdata.lastModifiedBy} readOnly />
                </div>
                <div className="col-2">
                  <input type="text" className="form-control" placeholder="Updated time and date" value={depdata.updated_at} readOnly />
                </div>
                <div className="col-1 button-set">
               
                <button style={{ border: 'none', padding: 0, background: 'none', cursor: 'pointer' }} onClick={() => deparmentDtails(depdata)}>
                    <ModeRoundedIcon />
               </button>
                  
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default User;
