const express = require("express")
const route = express.Router()
const { signUp, signIn, otpVerification, resendOtp, edumanOtp, dashDetails, sendGeneralMail, uploadSchoolImg, sendOtpToResetPassword,
    verifyResetPasswordOtp, resetPassword
} = require("../Controllers/admin.controller")

route.post("/signup", signUp)
route.post("/signin", signIn)
route.post("/otpVerification", otpVerification)
route.post("/resendOtp", resendOtp)
route.get("/edumanOtp", edumanOtp)
route.get("/dashDetails", dashDetails)
route.post("/sendgeneralmail", sendGeneralMail)
route.post("/uploadImg", uploadSchoolImg)
route.post("/resetotp", sendOtpToResetPassword)
route.post("/verifyresetotp", verifyResetPasswordOtp)
route.post("/resetpassword", resetPassword)














module.exports = route