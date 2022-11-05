const mongoose = require("mongoose")
const schoolModel = require("../Models/schoolModel")
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer")

const signUp = (req, res) => {
    let schoolForm = new schoolModel(req.body)
    schoolModel.findOne({ schoolEmail: req.body.schoolEmail }, (err, result) => {
        if (err) {
            res.send({ message: "An error occured", status: false })
        } else {
            if (result) {
                res.send({ message: "Email Already Exist", status: false })
            } else {
                schoolForm.save((err, result) => {
                    if (err) {
                        res.send({ message: "An error happened", status: false })
                        console.log("unable to save")
                    } else {
                        console.log("school info saved succesfully")
                        console.log(result)
                        const Otp = req.body.schoolEmail + ',' + String(req.body.otp)
                        const userOtp = jwt.sign({ pass: Otp }, process.env.Otp, { expiresIn: "1h" })

                        var transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: 'emeeylanr04@gmail.com',
                                pass: process.env.appPass,
                            }
                        })
                        var mailOptions = {
                            from: 'Ec',
                            to: `${req.body.schoolEmail}`,
                            subject: "Eduman",
                            text: '',
                            html: `<h1 style="text-align: center;color:#ff6400;">Eduman</h1>
                                    <p style="text-align: center;">Your OTP code is </p>
                                     <h1 style="color:#ff6400; text-align: center; padding:10px 0;">
                                   <span>${req.body.otp}</span>
                                     </h1>`
                        }
                        transporter.sendMail(mailOptions, (err, result) => {
                            if (err) {
                                res.send({ message: 'email not sentSuccesfully', status: true })
                            } else {
                                res.send({ message: 'email sent succesfully', status: true, pto: userOtp, schoolEmail: req.body.schoolEmail })

                            }
                        })
                    }
                })
            }
        }
    })

}


///Signinverification

const signIn = (req, res) => {
    schoolModel.findOne({ schoolEmail: req.body.schoolEmail }, (err, result) => {
        if (err) {
            res.send({ message: "an error occured", status: false })
        } else {
            if (result !== null) {
                result.validatePassword(req.body.schoolPass, (err, same) => {
                    if (err) {
                        res.send({ message: "an error occured", status: false })
                    } else {
                        if (same === true) {
                            if (result.otpStatus === false) {
                                const Otp = req.body.schoolEmail + ',' + String(req.body.otp)
                                const userOtp = jwt.sign({ pass: Otp }, process.env.Otp, { expiresIn: "1h" })
                                var transporter = nodemailer.createTransport({
                                    service: 'gmail',
                                    auth: {
                                        user: 'emeeylanr04@gmail.com',
                                        pass: process.env.appPass,
                                    }
                                })
                                var mailOptions = {
                                    from: 'Ec',
                                    to: `${req.body.schoolEmail}`,
                                    subject: "Eduman",
                                    text: '',
                                    html: `<h1 style="text-align: center;color:#ff6400;">Eduman</h1>
                                    <p style="text-align: center;">Your OTP code is </p>
                                     <h1 style="color:#ff6400; text-align: center; padding:10px 0;">
                                   <span>${req.body.otp}</span>
                                     </h1>`
                                }
                                transporter.sendMail(mailOptions, (err, result) => {
                                    if (err) {
                                        res.send({ message: 'email not sentSuccesfully', mailStatus: false })
                                    } else {
                                        res.send({ message: 'email sent succesfully', mailStatus: true, pto: userOtp, schoolEmail: req.body.schoolEmail })

                                    }
                                })

                            } else {
                                const mixeduserToken = String(result.schoolEmail) + "," + String(result._id)
                                const userToken = jwt.sign({ pass: mixeduserToken }, process.env.userToken, { expiresIn: "7days" })
                                res.send({ message: "Verification Succesful", userToken: userToken, status: true })
                            }
                        } else {
                            res.send({ message: "Invalid Password", status: false })
                        }
                    }

                })
            } else {
                res.send({ message: "Invalid Crendentails", status: false })
            }

        }

    })
}







///Otp Verification
const otpVerification = (req, res) => {
    const userToken = req.body.jwtOtp.split(" ")[0]
    jwt.verify(userToken, process.env.Otp, (err, result) => {
        if (err) {
            res.send({ message: "An error occured", status: false })
        } else {
            let userDetails = result.pass.split(",")

            if (Number(userDetails[1]) === Number(req.body.otp)) {
                console.log("valid")
                schoolModel.findOne({ schoolEmail: userDetails[0] }, (err, resultFound) => {
                    resultFound.otpStatus = true
                    schoolModel.findOneAndUpdate({ schoolEmail: userDetails[0] }, resultFound, (err) => {
                        if (err) {
                            console.log("unable to update")
                            res.send({ message: "an error occured", status: false })
                        } else {
                            console.log("otp status updated succesfully")
                            const mixeduserToken = String(resultFound.schoolEmail) + "," + String(resultFound._id)
                            const userToken = jwt.sign({ pass: mixeduserToken }, process.env.userToken, { expiresIn: "7days" })
                            res.send({ message: "updated succedfully", status: true, token: userToken })
                        }
                    })
                })
            } else {
                res.send({ message: "Invalid Otp Pin", status: false })

            }
        }
    })
}

///Resend Otp 
const resendOtp = (req, res) => {
    const Otp = req.body.schoolEmail + ',' + String(req.body.otp)
    const userOtp = jwt.sign({ pass: Otp }, process.env.Otp, { expiresIn: "1h" })
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'emeeylanr04@gmail.com',
            pass: process.env.appPass,
        }
    })
    var mailOptions = {
        from: 'Ec',
        to: `${req.body.schoolEmail}`,
        subject: "Eduman",
        text: '',
        html: `<h1 style="text-align: center;color:#ff6400;">Eduman</h1>
                <p style="text-align: center;">Your OTP code is </p>
                 <h1 style="color:#ff6400; text-align: center; padding:10px 0;">
               <span>${req.body.otp}</span>
                 </h1>`
    }
    transporter.sendMail(mailOptions, (err, result) => {
        if (err) {
            res.send({ message: 'An error occured sending otp', status: true })
        } else {
            res.send({ message: `An otp has been sent to ${req.body.schoolEmail} and it expires in 1hr`, status: true, pto: userOtp, schoolEmail: req.body.schoolEmail })

        }
    })

}
let schoolId = ""
let schoolEmail = ""
const edumanOtp = (req, res) => {
    const edumanotp = req.headers.authorization.split(" ")[1]
    jwt.verify(edumanotp, process.env.userToken, (err, result) => {
        if (err) {
            res.send({ message: "an error ocuured", status: false })
        } else {
            schoolId = result.pass.split(",")[1]
            schoolEmail = result.pass.split(",")[0]
            schoolModel.findOne({ _id: result.pass.split(",")[1] }, (err, result) => {
                if (err) {
                    res.send({ message: "couldn't find user, an error occured" })
                } else {
                    res.send({ status: true, schoolDetails: result },)
                }
            })

        }
    })

}





module.exports = {
    signUp,
    signIn,
    otpVerification,
    resendOtp,
    edumanOtp,

}