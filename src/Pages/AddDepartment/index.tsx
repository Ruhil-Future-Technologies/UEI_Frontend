import React, { useState } from 'react';
import useApi from '../../hooks/useAPI';
import { toast } from 'react-toastify';
interface Filters {
  department_name?: string;
  status?: string;
}

function AddDep() {
  const {postData}= useApi();
  const [filters, setFilters] = useState<Filters>({});
 


  const submithandeler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    postData(`${'department/add'}`,filters).then((data:any)=>{
      console.log(data);
      if(data?.status===200){
         console.log("data addded successfully");
      }else{
        console.log("error comes  successfully");
      }
    }).catch(e => {
      toast.error(e?.message, {
          hideProgressBar: true,
          theme: "colored",
          });
     });

    
  };

  const handelChanges = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFilters(values => ({ ...values, [name]: value }));
  };

  return (
    <>
      <h1>Add Department Panel</h1>
      <div className="container">
        <form onSubmit={submithandeler}>
          <div className="row-10 d-flex justify-content-between">
            <div className="col-6">
              <label>Department Name</label>
              <input
                className="form-control"
                type="text"
                name="department_name"
                value={filters.department_name || ''}
                onChange={handelChanges}
                autoFocus={false}
                placeholder="Enter department name"
              />
            </div>

            <div className="col-3">
              <label>Status</label>
              <select
                className="form-control"
                name="status"
                value={filters.status || ''}
                onChange={handelChanges}
              >
                <option value={'All'}>All</option>
                <option value={'Active'}>Active</option>
                <option value={'Inactive'}>Inactive</option>
              </select>
            </div>
          </div>
          <div className="d-flex justify-content-center">
            <button className="btn btn-primary sunbutton" type="submit">
              Add Department
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default AddDep;
