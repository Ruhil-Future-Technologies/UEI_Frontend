import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import emailicon from '../../assets/img/email.svg';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import useApi from '../../hooks/useAPI';
import { toast } from 'react-toastify';
import { QUERY_KEYS } from '../../utils/const';
import { FormControlLabel, Radio, RadioGroup } from '@mui/material';
const Forgotpassword = () => {
    const { postData } = useApi();
    const navigator = useNavigate()
    const [email, setEmail] = useState("")
    const [msg, setMsg] = useState("")
    const [value, setValue] = React.useState('student');
    const [isLoading, setIsLoading] = useState(false);
  
    const forgotpassUrl = QUERY_KEYS.FORGOT_PASSWORD;
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue((event.target as HTMLInputElement).value);
    };
    const sendLink = (e: any) => {
        setIsLoading(true)
        e.preventDefault();
        let UserSignUp = {
            email:email,
            user_type: String(value)
        };
        postData(`${forgotpassUrl}`, UserSignUp).then((data: any) => {
            if (data?.status === 200) {
                setMsg(data?.message)
                toast.success(data?.message, {
                    hideProgressBar: true,
                    theme: "colored",
                });
                setTimeout(() => {
                    navigator('/')
                }, 2000);
                setIsLoading(false)

            }else {
                toast.error(data?.message, {
                    hideProgressBar: true,
                    theme: "colored",
                });
                setIsLoading(false)

            }
            }).catch(e => {
                toast.error(e?.message, {
                    hideProgressBar: true,
                    theme: "colored",
                    });
                    setIsLoading(false)
               });
    }
  return (
    <div className="login">
    <div className="login_inner">

        <div className="form_wrapper">
            <div className="login_form">
                <div className="login_form_inner">

                <form>
                  <div className='title_wrapper'>
                    <h1 className="login_title">Forgot Password</h1>
                    <div className='desc'>We'll email you link to reset your password.</div>
                  </div>
                  <h4 className="text-success">{msg}</h4>
                    <div className="form_field_wrapper">
                    <RadioGroup
                        row
                        value={value}
                        onChange={handleChange}
                    >
                        <FormControlLabel value="student" control={<Radio />} label="Student" />
                        <FormControlLabel value="admin" control={<Radio />} label="Admin" />
                    </RadioGroup>
                        <TextField
                        onChange={(e) => setEmail(e.target.value)}
                        id="input-with-icon-textfield"
                        InputProps={{
                        startAdornment: (
                        <InputAdornment position="start">
                        <img src={emailicon} alt='email'/> 
                        </InputAdornment>
                        ),
                        }}
                        placeholder="Email"
                        variant="outlined"
                        />
                    </div>
                    {/* <div className="form_field_wrapper forgotpass">
                        <Link className="ato" to="/">Login</Link>
                    </div> */}
                    <div className="form_field_wrapper signuplink_block1 forgotpass">
                    <Link className="ato signupa" to="/">
                      <span className="signup_txt">Login</span>
                    </Link>
                  </div>
          
                    <button  type="submit" className='btn btn-primary' onClick={(e) => sendLink(e)} disabled={isLoading}>
                            Send Link
                    </button>
                </form>

                </div>
            </div>
        </div>
    </div>
  </div> 
  )
}

export default Forgotpassword
