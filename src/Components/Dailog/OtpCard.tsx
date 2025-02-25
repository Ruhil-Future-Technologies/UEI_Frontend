import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  TextField,
  DialogActions,
  Button,
} from '@mui/material';
import React, { useState } from 'react';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import useApi from "../../hooks/useAPI";

interface OtpCardProps {
    open: boolean;
    handleOtpClose: () => void; // Change 
    handleOtpSuccess: (opt: string) => void;
    email: string;
}

const OtpCard: React.FC<OtpCardProps> = ({ open, handleOtpClose, handleOtpSuccess, email }) => {
    const { postData } = useApi();


    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
   // const [viewBtn, setViewBtn] = useState(true);
    const [timeLeft, setTimeLeft] = useState(0);

  const handleOtpChange = (index: number, value: string) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

            // Auto-focus to next field
            if (value && index < 5) {
                document.getElementById(`otp-${index + 1}`)?.focus();
            }
        }
    };

  
    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").trim();

        if (/^\d{6}$/.test(pastedData)) {
            setOtp(pastedData.split(""));
        }
    };
    const handleOtpReset = () => {
        setOtp(["", "", "", "", "", ""]);
        document.getElementById(`otp-0`)?.focus();
    }

    const handleOtpResend = () => {
        setTimeLeft(120);
        
        let payload = {
            email: email
        }
        try {
            postData(`/auth/send-otp`, payload).then((response) => {
                console.log(response);
                const timer = setInterval(() => {
                    setTimeLeft((prev) => {
                        if (prev <= 1) {
                            clearInterval(timer);
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);
            })
        } catch (error) {

        }
        console.log(email)
    }

    const isOtpComplete = otp.every((digit) => digit !== "");
    const handleSubmitOtp = () => {
        const enteredOtp = otp.join("");
        if (enteredOtp.length === 6) {
            handleOtpSuccess(enteredOtp);
        }

    }
    return (
        <div>
            <Dialog open={open} onClose={handleOtpClose}>
                <div className="d-flex justify-content-end m-1">
                    <ClearOutlinedIcon onClick={handleOtpClose} />
                </div>
                <DialogTitle>{"Please verify your OTP."}</DialogTitle>
                <DialogContent>
                    <Box display="flex" justifyContent="center" gap={1} mt={1}>
                        {otp.map((digit, index) => (
                            <TextField
                                key={index}
                                id={`otp-${index}`}
                                autoComplete='flase'
                                value={digit}
                                onPaste={handlePaste}
                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                inputProps={{ maxLength: 1, style: { textAlign: "center", fontSize: "1.5rem" } }}
                                variant="outlined"
                                size="small"
                                sx={{ width: "50px" }}
                            />
                        ))}
                    </Box>
                </DialogContent>
                <DialogActions>
                    {timeLeft > 0 ? (
                        <span style={{color:"red"}}>{`${Math.floor(timeLeft / 60)
                            .toString()
                            .padStart(2, "0")}:${(timeLeft % 60).toString().padStart(2, "0")}`}</span>
                    ) : (
                        <Button className="content-left" onClick={handleOtpResend} color="primary">
                            Resend OTP
                        </Button>
                    )}
                    <Button onClick={handleOtpReset} color="primary">
                        reset
                    </Button>
                    <Button onClick={handleSubmitOtp} color="primary" disabled={!isOtpComplete}>
                        Verify
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default OtpCard;
