import { useEffect, useState } from "react";
import useApi from '../../hooks/useAPI';
import { toast } from 'react-toastify';
interface Department {
    department_name: string;
    is_active: string;
    created_by: string;
    created_at: string;
    lastModifiedBy: string;
    updated_at: string;
  }
function EditDepartment(){
    const {getData}=useApi();
    const [perdata , serPredata]=useState({
        department_name:'',
        is_active:0
    });
    useEffect(()=>{
       getData(`${'department/edit/2'}`,true).then((data:any)=>{
        console.log(data);
        if(data?.status===200){
          console.log("ok");
          serPredata(data.data);
        }else{
            console.log("not ok");
        }
       }).catch(e => {
        toast.error(e?.message, {
            hideProgressBar: true,
            theme: "colored",
            });
       });
    },[])
    const submithandeler=()=>{

    }

    const handelChanges=()=>{

    }
    console.log(perdata.is_active)
    return (
        
        <>
     <h1>edit deparment is working </h1>
        <div className="container">
          <form onSubmit={submithandeler}>
            <div className="row-10 d-flex justify-content-between">
              <div className="col-6">
                <label>Department Name</label>
                <input
                  className="form-control"
                  type="text"
                  name="department_name"
                  value={perdata.department_name || ''}
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
                  value={perdata.is_active==1?'Active':'Inactive'}
                  onChange={handelChanges}
                >
                  <option value={2}>All</option>
                  <option value={1}>Active</option>
                  <option value={0}>Inactive</option>
                </select>
              </div>
            </div>
            <div className="d-flex justify-content-center">
              <button className="btn btn-primary sunbutton" type="submit">
                Update Department
              </button>
            </div>
          </form>
        </div>
      </>
    )
}
export default EditDepartment;