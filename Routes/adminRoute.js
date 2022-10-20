const express = require("express")
const route = express.Router()
const { signUp, signIn, otpVerification, resendOtp } = require("../Controllers/admin.controller")

route.post("/signup", signUp)
route.post("/signin", signIn)
route.post("/otpVerification", otpVerification)
route.post("/resendOtp", resendOtp)















module.exports = route