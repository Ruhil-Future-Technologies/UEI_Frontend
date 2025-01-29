import { Dialog, DialogTitle, DialogContent, Box, TextField, DialogActions, Button } from "@mui/material";
import React, { useState } from "react";
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
interface OtpCardProps {
    open: boolean;
    handleOtpClose: () => void; // Change this
}

const OtpCard: React.FC<OtpCardProps> = ({ open, handleOtpClose }) => {
    const [otp, setOtp] = useState(["", "", "", ""]);


    const handleOtpChange = (index: number, value: string) => {
        if (/^\d?$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            // Auto-focus to next field
            if (value && index < 3) {
                document.getElementById(`otp-${index + 1}`)?.focus();
            }
        }
    };
    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").trim();

        if (/^\d{4}$/.test(pastedData)) {
            setOtp(pastedData.split(""));
        }
    };
    const handleOtpReset=()=>{
        setOtp(["", "", "", ""]);
        document.getElementById(`otp-0`)?.focus();
    }
    const isOtpComplete = otp.every((digit) => digit !== "");
    return (
        <div>
            <Dialog open={open} onClose={handleOtpClose}>
                <div className="d-flex justify-content-end m-1">
                    <ClearOutlinedIcon onClick={handleOtpClose} />
                </div>
                <DialogTitle>{"Confirm Your OTP"}</DialogTitle>
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
                    <Button onClick={handleOtpReset} color="primary">
                        reset
                    </Button>
                    <Button onClick={() => alert("OTP Confirmed!")} color="primary" disabled={!isOtpComplete}>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default OtpCard;