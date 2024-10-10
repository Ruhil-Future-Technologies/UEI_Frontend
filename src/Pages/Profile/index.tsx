import {useState } from "react";


function Profile(){
    const [name, setCount] = useState('atul yadav');

    return <>
  
    <h1>I've rendered {name} times!</h1>;
   
    </>
}


export default Profile;