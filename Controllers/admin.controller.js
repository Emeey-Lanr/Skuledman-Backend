const mongoose = require("mongoose")
const schoolModel = require("../Models/schoolModel")
const studentModel = require("../Models/Student")
const setSchemaModel = require("../Models/set")
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer")
const bcrypt = require("bcryptjs")
const cloudinary = require("cloudinary")
cloudinary.config({
    cloud_name: process.env.cloudName,
    api_key: process.env.cloudinaryApiKey,
    api_secret: process.env.cloudinaryApiSecret
});

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
                                user: 'skuledman@gmail.com',
                                pass: process.env.appPass,
                            }
                        })
                        var mailOptions = {
                            from: 'Skuledman',
                            to: `${req.body.schoolEmail}`,
                            subject: "Skuledman Email Verification",
                            text: '',
                            html: `  <h1 style="text-align: center;color:#ff6400;">Eduman</h1>
                            <div style="display:flex; justify-content:center;">
                                <div style="display: flex; padding: 30px 0;">
                                    <div className="logo1" style="
                                                        width: 20px;
                                                        height: 40px;
                                                        border: 1px solid #ff6400;
                                                        border-radius: 10px 0 10px 0;
                                                    ">
                                        <div></div>
                                        <div></div>
                                    </div>
                                    <div style="
                                                        width: 20px;
                                                        height: 40px;
                                                        border: 1px solid #ff6400;
                                                        border-radius: 0px 10px 0px 10px;
                                                    
                                                    ">
                                        <div style=" border-bottom: 1px solid #ff6400;
                                                        height: 5px;
                                                        margin-bottom: 5px;
                                                        width: 100%;
                                                        "></div>
                                        <div style=" border-bottom: 1px solid #ff6400;
                                                        height: 5px;
                                                        margin-bottom: 5px;
                                                        width: 100%;
                                                        "></div>
                                        <div style=" border-bottom: 1px solid #ff6400;
                                                        height: 5px;
                                                        margin-bottom: 5px;
                                                        width: 100%;
                                                        "></div>
                                        <div style=" border-bottom: 1px solid #ff6400;
                                                        height: 5px;
                                                        margin-bottom: 5px;
                                                        width: 100%;
                                                        "></div>
                                    </div>
                        
                                </div>
                            </div>
                            <p style="text-align: center; font-family: sans-serif;">Your OTP code is </p>
                            <h1 style="color:#ff6400; text-align: center; padding:10px 0;">
                                <span>${req.body.otp}</span>
                            </h1>
                        `
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
                                        user: 'skuledman@gmail.com',
                                        pass: process.env.appPass,
                                    }
                                })
                                var mailOptions = {
                                    from: 'Ec',
                                    to: `${req.body.schoolEmail}`,
                                    subject: "Skuledman Verification",
                                    text: '',
                                    html: `  <h1 style="text-align: center;color:#ff6400;">Eduman</h1>
                                    <div style="display:flex; justify-content:center;">
                                        <div style="display: flex; padding: 30px 0;">
                                            <div className="logo1" style="
                                                                width: 20px;
                                                                height: 40px;
                                                                border: 1px solid #ff6400;
                                                                border-radius: 10px 0 10px 0;
                                                            ">
                                                <div></div>
                                                <div></div>
                                            </div>
                                            <div style="
                                                                width: 20px;
                                                                height: 40px;
                                                                border: 1px solid #ff6400;
                                                                border-radius: 0px 10px 0px 10px;
                                                            
                                                            ">
                                                <div style=" border-bottom: 1px solid #ff6400;
                                                                height: 5px;
                                                                margin-bottom: 5px;
                                                                width: 100%;
                                                                "></div>
                                                <div style=" border-bottom: 1px solid #ff6400;
                                                                height: 5px;
                                                                margin-bottom: 5px;
                                                                width: 100%;
                                                                "></div>
                                                <div style=" border-bottom: 1px solid #ff6400;
                                                                height: 5px;
                                                                margin-bottom: 5px;
                                                                width: 100%;
                                                                "></div>
                                                <div style=" border-bottom: 1px solid #ff6400;
                                                                height: 5px;
                                                                margin-bottom: 5px;
                                                                width: 100%;
                                                                "></div>
                                            </div>
                                
                                        </div>
                                    </div>
                                    <p style="text-align: center; font-family: sans-serif;">Your OTP code is </p>
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
            user: 'skuledman@gmail.com',
            pass: process.env.appPass,
        }
    })
    var mailOptions = {
        from: 'Skuledman',
        to: `${req.body.schoolEmail}`,
        subject: "Skuledman Email Verification",
        text: '',
        html: ` <h1 style="text-align: center;color:#ff6400;">Eduman</h1>
        <div style="display:flex; justify-content:center;">
            <div style="display: flex; padding: 30px 0;">
                <div className="logo1" style="
                                    width: 20px;
                                    height: 40px;
                                    border: 1px solid #ff6400;
                                    border-radius: 10px 0 10px 0;
                                ">
                    <div></div>
                    <div></div>
                </div>
                <div style="
                                    width: 20px;
                                    height: 40px;
                                    border: 1px solid #ff6400;
                                    border-radius: 0px 10px 0px 10px;
                                
                                ">
                    <div style=" border-bottom: 1px solid #ff6400;
                                    height: 5px;
                                    margin-bottom: 5px;
                                    width: 100%;
                                    "></div>
                    <div style=" border-bottom: 1px solid #ff6400;
                                    height: 5px;
                                    margin-bottom: 5px;
                                    width: 100%;
                                    "></div>
                    <div style=" border-bottom: 1px solid #ff6400;
                                    height: 5px;
                                    margin-bottom: 5px;
                                    width: 100%;
                                    "></div>
                    <div style=" border-bottom: 1px solid #ff6400;
                                    height: 5px;
                                    margin-bottom: 5px;
                                    width: 100%;
                                    "></div>
                </div>
    
            </div>
        </div>
        <p style="text-align: center; font-family: sans-serif;">Your OTP code is </p>
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
                    res.send({ message: "couldn't find user, an error occured", status: false })
                } else {

                    res.send({ status: true, schoolDetails: result })



                }
            })

        }
    })

}

const dashDetails = (req, res) => {
    let schoolEmail = ""
    let schoolDetails = {}
    let schoolId = ""
    //  Jss1
    let Jss1StudentNoFirstTerm = []
    let Jss1StudentNoSecondTerm = []
    let Jss1StudentNoThirdTerm = []
    let Jss1StudentNumber = 0
    let Jss1TotalPaidSchoolFees = 0
    let Jss1TotalPaidPtaFees = 0
    let Jss1TotalPaid = 0
    let estimatedJss1FeeTotal = 0
    let Jss1TotalDebt = 0
    let Jss1StudentTerm = "FirstTerm"
    let Jss1Set = ""
    // Jss2
    let Jss2StudentNoFirstTerm = []
    let Jss2StudentNoSecondTerm = []
    let Jss2StudentNoThirdTerm = []
    let Jss2StudentNumber = 0
    let Jss2TotalPaidSchoolFees = 0
    let Jss2TotalPaidPtaFees = 0
    let Jss2TotalPaid = 0
    let estimatedJss2FeeTotal = 0
    let Jss2TotalDebt = 0
    let Jss2StudentTerm = "FirstTerm"
    let Jss2Set = ""
    //Jss3
    let Jss3StudentNoFirstTerm = []
    let Jss3StudentNoSecondTerm = []
    let Jss3StudentNoThirdTerm = []
    let Jss3StudentNumber = 0
    let Jss3TotalPaidSchoolFees = 0
    let Jss3TotalPaidPtaFees = 0
    let Jss3TotalPaid = 0
    let estimatedJss3FeeTotal = 0
    let Jss3TotalDebt = 0
    let Jss3StudentTerm = "FirstTerm"
    let Jss3Set = ""

    //Sss1
    let Sss1StudentNoFirstTerm = []
    let Sss1StudentNoSecondTerm = []
    let Sss1StudentNoThirdTerm = []
    let Sss1StudentNumber = 0
    let Sss1TotalPaidSchoolFees = 0
    let Sss1TotalPaidPtaFees = 0
    let Sss1TotalPaid = 0
    let estimatedSss1FeeTotal = 0
    let Sss1TotalDebt = 0
    let Sss1StudentTerm = "FirstTerm"
    let Sss1Set = ""

    //Sss2
    let Sss2StudentNoFirstTerm = []
    let Sss2StudentNoSecondTerm = []
    let Sss2StudentNoThirdTerm = []
    let Sss2StudentNumber = 0
    let Sss2TotalPaidSchoolFees = 0
    let Sss2TotalPaidPtaFees = 0
    let Sss2TotalPaid = 0
    let estimatedSss2FeeTotal = 0
    let Sss2TotalDebt = 0
    let Sss2StudentTerm = "FirstTerm"
    let Sss2Set = ""

    //Sss3
    let Sss3StudentNoFirstTerm = []
    let Sss3StudentNoSecondTerm = []
    let Sss3StudentNoThirdTerm = []
    let Sss3StudentNumber = 0
    let Sss3TotalPaidSchoolFees = 0
    let Sss3TotalPaidPtaFees = 0
    let Sss3TotalPaid = 0
    let estimatedSss3FeeTotal = 0
    let Sss3TotalDebt = 0
    let Sss3StudentTerm = "FirstTerm"
    let Sss3Set = ""

    ///it shows the graphical represntation of how each student paid each term

    const comingId = req.headers.authorization.split(" ")[1]
    jwt.verify(comingId, process.env.userToken, (err, result) => {
        if (err) {
            console.log(err)
            res.send({ message: "an error occured", status: false })
        } else {
            let totalDebt = 0
            let status = false
            schoolId = result.pass.split(",")[1]
            schoolEmail = result.pass.split(",")[0]
            schoolModel.findOne({ _id: result.pass.split(",")[1] }, (err, result) => {
                if (err) {
                    res.send({ status: false })
                } else {
                    schoolDetails = result
                    setSchemaModel.find({ schoolId: schoolId }, (err, result) => {
                        if (err) {
                            res.send({ message: "an error occured", status: false })
                        } else {
                            if (result.length > 0) {

                                ///Junior
                                const jss1ClassSet = result.filter((info) => info.class === "Jss1")
                                console.log(jss1ClassSet, "********")
                                const Jss2ClassSet = result.filter((info) => info.class === "Jss2")
                                console.log(Jss2ClassSet, "}}}}}}}")
                                const Jss3ClassSet = result.filter((info) => info.class === "Jss3")
                                // Senior
                                const Sss1ClassSet = result.filter((info) => info.class === "Sss1")
                                const Sss2ClassSet = result.filter((info) => info.class === "Sss2")
                                const Sss3ClassSet = result.filter((info) => info.class === "Sss3")
                                console.log(Sss3ClassSet)

                                ///Junior

                                let currentJss1Set = {}

                                if (jss1ClassSet.length > 0) {
                                    currentJss1Set = jss1ClassSet[jss1ClassSet.length - 1]
                                    Jss1Set = currentJss1Set.set

                                }
                                let currentJss2Set = {}
                                if (Jss2ClassSet.length > 0) {
                                    currentJss2Set = Jss2ClassSet[Jss2ClassSet.length - 1]
                                    Jss2Set = currentJss2Set.set
                                }
                                let currentJss3Set = {}
                                if (Jss3ClassSet.length > 0) {
                                    currentJss3Set = Jss3ClassSet[Jss3ClassSet.length - 1]
                                    Jss3Set = currentJss3Set.set
                                }

                                ///Senior
                                let currentSss1Set = {}
                                if (Sss1ClassSet.length > 0) {
                                    currentSss1Set = Sss1ClassSet[Sss1ClassSet.length - 1]
                                    Sss1Set = currentSss1Set.set
                                }
                                let currentSss2Set = {}
                                if (Sss2ClassSet.length > 0) {
                                    currentSss2Set = Sss2ClassSet[Sss2ClassSet.length - 1]
                                    Sss2Set = currentSss2Set.set
                                }
                                let currentSss3Set = {}
                                if (Sss3ClassSet.length > 0) {
                                    currentSss3Set = Sss3ClassSet[Sss3ClassSet.length - 1]
                                    Sss3Set = currentSss3Set.set
                                }


                                ///Jss1
                                let checkStudent = false
                                const calculateJssOne = () => {
                                    if (jss1ClassSet.length > 0) {
                                        return new Promise((resolve, reject) => {
                                            studentModel.find({ jss1Id: currentJss1Set._id }, (err, result) => {
                                                if (err) {
                                                    status = true
                                                } else {

                                                    Jss1StudentNoFirstTerm = result.filter((info) => info.jss1.firstTermStatus === true)
                                                    Jss1StudentNoSecondTerm = result.filter((info) => info.jss1.secondTermStatus === true)
                                                    Jss1StudentNoThirdTerm = result.filter((info) => info.jss1.thirdTermStatus === true)
                                                    if (Jss1StudentNoFirstTerm.length > 0 && Jss1StudentNoSecondTerm.length === 0 && Jss1StudentNoThirdTerm.length === 0) {
                                                        Jss1StudentTerm = "FirstTerm"
                                                        Jss1StudentNumber = Jss1StudentNoFirstTerm.length
                                                        /////Calculation for debit and credit

                                                        result.map((info) => {
                                                            Jss1TotalPaidSchoolFees += Number(info.jss1.firstTermSchoolFees)
                                                            Jss1TotalPaidPtaFees += Number(info.jss1.firstTermPtaFees)
                                                        })



                                                        Jss1TotalPaid = Number(Jss1TotalPaidSchoolFees) + Number(Jss1TotalPaidPtaFees)
                                                        estimatedJss1FeeTotal = (Number(currentJss1Set.firstTerm.schoolFees) + Number(currentJss1Set.firstTerm.ptaFees)) * Number(Jss1StudentNumber)
                                                        Jss1TotalDebt = estimatedJss1FeeTotal - Jss1TotalPaid


                                                    } else if (Jss1StudentNoSecondTerm.length > 0 && Jss1StudentNoThirdTerm === 0) {
                                                        Jss1StudentTerm = "Second Term"
                                                        Jss1StudentNumber = Jss1StudentNoSecondTerm.length
                                                        result.map((info) => {
                                                            Jss1TotalPaidSchoolFees += Number(info.jss1.secondTermSchoolFees)
                                                            Jss1TotalPaidPtaFees += Number(info.jss1.secondTermPtaFees)
                                                        })



                                                        Jss1TotalPaid = Number(Jss1TotalPaidSchoolFees) + Number(Jss1TotalPaidPtaFees)
                                                        estimatedJss1FeeTotal = (Number(currentJss1Set.secondTerm.schoolFees) + Number(currentJss1Set.secondTerm.ptaFees)) * Number(Jss1StudentNumber)
                                                        Jss1TotalDebt = estimatedJss1FeeTotal - Jss1TotalPaid


                                                    } else if (Jss1StudentNoThirdTerm.length > 0) {
                                                        Jss1StudentTerm = "Third Term"
                                                        Jss1StudentTerm = Jss1StudentNoThirdTerm.length
                                                        result.map((info) => {
                                                            Jss1TotalPaidSchoolFees += Number(info.jss1.thirdTermSchoolFees)
                                                            Jss1TotalPaidPtaFees += Number(info.jss1.thirdTermPtaFees)
                                                        })



                                                        Jss1TotalPaid = Number(Jss1TotalPaidSchoolFees) + Number(Jss1TotalPaidPtaFees)
                                                        estimatedJss1FeeTotal = (Number(currentJss1Set.thirdTerm.schoolFees) + Number(currentJss1Set.thirdTerm.ptaFees)) * Number(Jss1StudentNumber)
                                                        Jss1TotalDebt = estimatedJss1FeeTotal - Jss1TotalPaid
                                                    }





                                                }
                                                const error = false
                                                if (!error) {
                                                    resolve()
                                                } else {
                                                    reject("an error occured")
                                                }
                                            })

                                        })

                                    }
                                }
                                const calculateJssTwo = () => {
                                    if (Jss2ClassSet.length > 0) {
                                        return new Promise((resolve, reject) => {
                                            studentModel.find({ jss2Id: currentJss2Set._id }, (err, result) => {
                                                if (err) {
                                                    status = true
                                                } else {

                                                    Jss2StudentNoFirstTerm = result.filter((info) => info.jss2.firstTermStatus === true)
                                                    Jss2StudentNoSecondTerm = result.filter((info) => info.jss2.secondTermStatus === true)
                                                    Jss2StudentNoThirdTerm = result.filter((info) => info.jss2.thirdTermStatus === true)
                                                    if (Jss2StudentNoFirstTerm.length > 0 && Jss2StudentNoSecondTerm.length === 0 && Jss2StudentNoThirdTerm.length === 0) {
                                                        Jss2StudentNumber = Jss2StudentNoFirstTerm.length
                                                        /////Calculation for debit and credit

                                                        result.map((info) => {
                                                            Jss2TotalPaidSchoolFees += Number(info.jss2.firstTermSchoolFees)
                                                            Jss2TotalPaidPtaFees += Number(info.jss2.firstTermPtaFees)
                                                        })



                                                        Jss2TotalPaid = Number(Jss2TotalPaidSchoolFees) + Number(Jss2TotalPaidPtaFees)

                                                        estimatedJss2FeeTotal = (Number(currentJss2Set.firstTerm.schoolFees) + Number(currentJss2Set.firstTerm.ptaFees)) * Number(Jss2StudentNumber)
                                                        Jss2TotalDebt = estimatedJss2FeeTotal - Jss2TotalPaid


                                                    } else if (Jss2StudentNoSecondTerm.length > 0 && Jss2StudentNoThirdTerm === 0) {
                                                        Jss2StudentNumber = Jss2StudentNoSecondTerm.length
                                                        result.map((info) => {
                                                            Jss2TotalPaidSchoolFees += Number(info.jss2.secondTermSchoolFees)
                                                            Jss2TotalPaidPtaFees += Number(info.jss2.secondTermPtaFees)
                                                        })



                                                        Jss2TotalPaid = Number(Jss2TotalPaidSchoolFees) + Number(Jss2TotalPaidPtaFees)

                                                        estimatedJss2FeeTotal = (Number(currentJss2Set.secondTerm.schoolFees) + Number(currentJss2Set.secondTerm.ptaFees)) * Number(Jss2StudentNumber)
                                                        Jss2TotalDebt = estimatedJss2FeeTotal - Jss2TotalPaid

                                                    } else if (Jss2StudentNoThirdTerm.length > 0) {
                                                        Jss2StudentTerm = Jss2StudentNoThirdTerm.length
                                                        Jss2StudentNumber = Jss2StudentNoSecondTerm.length
                                                        result.map((info) => {
                                                            Jss2TotalPaidSchoolFees += Number(info.jss2.thirdTermSchoolFees)
                                                            Jss2TotalPaidPtaFees += Number(info.jss2.thirdTermPtaFees)
                                                        })



                                                        Jss2TotalPaid = Number(Jss2TotalPaidSchoolFees) + Number(Jss2TotalPaidPtaFees)

                                                        estimatedJss2FeeTotal = (Number(currentJss2Set.thirdTerm.schoolFees) + Number(currentJss2Set.thirdTerm.ptaFees)) * Number(Jss2StudentNumber)
                                                        Jss2TotalDebt = estimatedJss2FeeTotal - Jss2TotalPaid

                                                    }





                                                }
                                                const error = false
                                                if (!error) {
                                                    resolve()
                                                } else {
                                                    reject("an error occured")
                                                }
                                            })


                                        })
                                    }




                                }
                                const calculateJssThree = () => {
                                    if (Jss3ClassSet.length > 0) {
                                        return new Promise((resolve, reject) => {
                                            studentModel.find({ jss3Id: currentJss3Set._id }, (err, result) => {
                                                if (err) {
                                                    status = true
                                                } else {

                                                    Jss3StudentNoFirstTerm = result.filter((info) => info.jss3.firstTermStatus === true)
                                                    Jss3StudentNoSecondTerm = result.filter((info) => info.jss3.secondTermStatus === true)
                                                    Jss3StudentNoThirdTerm = result.filter((info) => info.jss3.thirdTermStatus === true)
                                                    if (Jss3StudentNoFirstTerm.length > 0 && Jss3StudentNoSecondTerm.length === 0 && Jss3StudentNoThirdTerm.length === 0) {
                                                        Jss3StudentNumber = Jss2StudentNoFirstTerm.length
                                                        /////Calculation for debit and credit

                                                        result.map((info) => {
                                                            Jss3TotalPaidSchoolFees += Number(info.jss3.firstTermSchoolFees)
                                                            Jss3TotalPaidPtaFees += Number(info.jss3.firstTermPtaFees)
                                                        })



                                                        Jss3TotalPaid = Number(Jss3TotalPaidSchoolFees) + Number(Jss3TotalPaidPtaFees)
                                                        estimatedJss3FeeTotal = (Number(currentJss3Set.firstTerm.schoolFees) + Number(currentJss3Set.firstTerm.ptaFees)) * Number(Jss3StudentNumber)
                                                        Jss3TotalDebt = estimatedJss3FeeTotal - Jss3TotalPaid



                                                    } else if (Jss3StudentNoSecondTerm.length > 0 && Jss3StudentNoThirdTerm === 0) {
                                                        Jss3StudentNumber = Jss3StudentNoSecondTerm.length

                                                        result.map((info) => {
                                                            Jss3TotalPaidSchoolFees += Number(info.jss3.secondTermSchoolFees)
                                                            Jss3TotalPaidPtaFees += Number(info.jss3.secondTermPtaFees)
                                                        })



                                                        Jss3TotalPaid = Number(Jss3TotalPaidSchoolFees) + Number(Jss3TotalPaidPtaFees)
                                                        estimatedJss3FeeTotal = (Number(currentJss3Set.secondTerm.schoolFees) + Number(currentJss3Set.secondTerm.ptaFees)) * Number(Jss3StudentNumber)
                                                        Jss3TotalDebt = estimatedJss3FeeTotal - Jss3TotalPaid

                                                    } else if (Jss3StudentNoThirdTerm.length > 0) {
                                                        Jss3StudentTerm = Jss3StudentNoThirdTerm.length
                                                        result.map((info) => {
                                                            Jss3TotalPaidSchoolFees += Number(info.jss3.thirdTermSchoolFees)
                                                            Jss3TotalPaidPtaFees += Number(info.jss3.thirdTermPtaFees)
                                                        })



                                                        Jss3TotalPaid = Number(Jss3TotalPaidSchoolFees) + Number(Jss3TotalPaidPtaFees)
                                                        estimatedJss3FeeTotal = (Number(currentJss3Set.thirdTerm.schoolFees) + Number(currentJss3Set.thirdTerm.ptaFees)) * Number(Jss3StudentNumber)
                                                        Jss3TotalDebt = estimatedJss3FeeTotal - Jss3TotalPaid
                                                    }





                                                }
                                                const error = false
                                                if (!error) {
                                                    resolve()
                                                } else {
                                                    reject("an error occured")
                                                }
                                            })


                                        })
                                    }

                                }
                                const calculateSss1 = () => {
                                    if (Sss1ClassSet.length > 0) {
                                        return new Promise((resolve, reject) => {
                                            studentModel.find({ sss1Id: currentSss1Set._id }, (err, result) => {
                                                if (err) {
                                                    status = true
                                                } else {

                                                    Sss1StudentNoFirstTerm = result.filter((info) => info.sss1.firstTermStatus === true)
                                                    Sss1StudentNoSecondTerm = result.filter((info) => info.sss1.secondTermStatus === true)
                                                    Sss1StudentNoThirdTerm = result.filter((info) => info.sss1.thirdTermStatus === true)
                                                    if (Sss1StudentNoFirstTerm.length > 0 && Sss1StudentNoSecondTerm.length === 0 && Sss1StudentNoThirdTerm.length === 0) {
                                                        Sss1StudentNumber = Sss1StudentNoFirstTerm.length
                                                        /////Calculation for debit and credit

                                                        result.map((info) => {
                                                            Sss1TotalPaidSchoolFees += Number(info.sss1.firstTermSchoolFees)
                                                            Sss1TotalPaidPtaFees += Number(info.sss1.firstTermPtaFees)
                                                        })



                                                        Sss1TotalPaid = Number(Sss1TotalPaidSchoolFees) + Number(Sss1TotalPaidPtaFees)
                                                        estimatedSss1FeeTotal = (Number(currentSss1Set.firstTerm.schoolFees) + Number(currentSss1Set.firstTerm.ptaFees)) * Number(Sss1StudentNumber)
                                                        Sss1TotalDebt = estimatedSss1FeeTotal - Sss1TotalPaid



                                                    } else if (Sss1StudentNoSecondTerm.length > 0 && Sss1StudentNoThirdTerm === 0) {
                                                        Sss1StudentNumber = Sss1StudentNoSecondTerm.length
                                                        result.map((info) => {
                                                            Sss1TotalPaidSchoolFees += Number(info.sss1.secondTermSchoolFees)
                                                            Sss1TotalPaidPtaFees += Number(info.sss1.secondTermPtaFees)
                                                        })



                                                        Sss1TotalPaid = Number(Sss1TotalPaidSchoolFees) + Number(Sss1TotalPaidPtaFees)
                                                        estimatedSss1FeeTotal = (Number(currentSss1Set.secondTerm.schoolFees) + Number(currentSss1Set.secondTerm.ptaFees)) * Number(Sss1StudentNumber)
                                                        Sss1TotalDebt = estimatedSss1FeeTotal - Sss1TotalPaid
                                                    } else if (Sss1StudentNoThirdTerm.length > 0) {
                                                        Sss1StudentNumber = Sss1StudentNoThirdTerm.length

                                                        result.map((info) => {
                                                            Sss1TotalPaidSchoolFees += Number(info.sss1.thirdTermSchoolFees)
                                                            Sss1TotalPaidPtaFees += Number(info.sss1.thirdTermPtaFees)
                                                        })



                                                        Sss1TotalPaid = Number(Sss1TotalPaidSchoolFees) + Number(Sss1TotalPaidPtaFees)
                                                        estimatedSss1FeeTotal = (Number(currentSss1Set.thirdTerm.schoolFees) + Number(currentSss1Set.thirdTerm.ptaFees)) * Number(Sss1StudentNumber)
                                                        Sss1TotalDebt = estimatedSss1FeeTotal - Sss1TotalPaid
                                                    }





                                                }
                                                const error = false
                                                if (!error) {
                                                    resolve()
                                                } else {
                                                    reject("an error occured")
                                                }
                                            })


                                        })
                                    }

                                }
                                const calculateSss2 = () => {
                                    if (Sss2ClassSet.length > 0) {
                                        return new Promise((resolve, reject) => {
                                            studentModel.find({ sss2Id: currentSss2Set._id }, (err, result) => {
                                                if (err) {
                                                    status = true
                                                } else {

                                                    Sss2StudentNoFirstTerm = result.filter((info) => info.sss2.firstTermStatus === true)
                                                    Sss2StudentNoSecondTerm = result.filter((info) => info.sss2.secondTermStatus === true)
                                                    Sss2StudentNoThirdTerm = result.filter((info) => info.sss2.thirdTermStatus === true)
                                                    if (Sss2StudentNoFirstTerm.length > 0 && Sss2StudentNoSecondTerm.length === 0 && Sss2StudentNoThirdTerm.length === 0) {
                                                        Sss2StudentNumber = Sss2StudentNoFirstTerm.length
                                                        /////Calculation for debit and credit

                                                        result.map((info) => {
                                                            Sss2TotalPaidSchoolFees += Number(info.sss2.firstTermSchoolFees)
                                                            Sss2TotalPaidPtaFees += Number(info.sss2.firstTermPtaFees)
                                                        })



                                                        Sss2TotalPaid = Number(Sss2TotalPaidSchoolFees) + Number(Sss2TotalPaidPtaFees)
                                                        estimatedSss1FeeTotal = (Number(currentSss2Set.firstTerm.schoolFees) + Number(currentSss2Set.firstTerm.ptaFees)) * Number(Sss2StudentNumber)
                                                        Sss2TotalDebt = estimatedSss2FeeTotal - Sss2TotalPaid



                                                    } else if (Sss2StudentNoSecondTerm.length > 0 && Sss2StudentNoThirdTerm === 0) {
                                                        Sss2StudentNumber = Sss2StudentNoSecondTerm.length

                                                        result.map((info) => {
                                                            Sss2TotalPaidSchoolFees += Number(info.sss2.secondTermSchoolFees)
                                                            Sss2TotalPaidPtaFees += Number(info.sss2.secondTermPtaFees)
                                                        })



                                                        Sss2TotalPaid = Number(Sss2TotalPaidSchoolFees) + Number(Sss2TotalPaidPtaFees)
                                                        estimatedSss1FeeTotal = (Number(currentSss2Set.secondTerm.schoolFees) + Number(currentSss2Set.secondTerm.ptaFees)) * Number(Sss2StudentNumber)
                                                        Sss2TotalDebt = estimatedSss2FeeTotal - Sss2TotalPaid


                                                    } else if (Sss2StudentNoThirdTerm.length > 0) {
                                                        Sss2StudentTerm = Sss2StudentNoThirdTerm.length
                                                        result.map((info) => {
                                                            Sss2TotalPaidSchoolFees += Number(info.sss2.thirdTermSchoolFees)
                                                            Sss2TotalPaidPtaFees += Number(info.sss2.thirdTermPtaFees)
                                                        })



                                                        Sss2TotalPaid = Number(Sss2TotalPaidSchoolFees) + Number(Sss2TotalPaidPtaFees)
                                                        estimatedSss1FeeTotal = (Number(currentSss2Set.thirdTerm.schoolFees) + Number(currentSss2Set.thirdTerm.ptaFees)) * Number(Sss2StudentNumber)
                                                        Sss2TotalDebt = estimatedSss2FeeTotal - Sss2TotalPaid
                                                    }





                                                }
                                                const error = false
                                                if (!error) {
                                                    resolve()
                                                } else {
                                                    reject("an error occured")
                                                }
                                            })


                                        })
                                    }

                                }

                                const calculateSss3 = () => {
                                    if (Sss3ClassSet.length > 0) {
                                        return new Promise((resolve, reject) => {
                                            studentModel.find({ sss3Id: currentSss3Set._id }, (err, result) => {
                                                if (err) {
                                                    status = true
                                                } else {

                                                    Sss3StudentNoFirstTerm = result.filter((info) => info.sss3.firstTermStatus === true)
                                                    Sss3StudentNoSecondTerm = result.filter((info) => info.sss3.secondTermStatus === true)
                                                    Sss3StudentNoThirdTerm = result.filter((info) => info.sss3.thirdTermStatus === true)
                                                    if (Sss3StudentNoFirstTerm.length > 0 && Sss3StudentNoSecondTerm.length === 0 && Sss3StudentNoThirdTerm.length === 0) {
                                                        Sss3StudentNumber = Sss2StudentNoFirstTerm.length
                                                        /////Calculation for debit and credit

                                                        result.map((info) => {
                                                            Sss3TotalPaidSchoolFees += Number(info.sss3.firstTermSchoolFees)
                                                            Sss3TotalPaidPtaFees += Number(info.sss3.firstTermPtaFees)
                                                        })



                                                        Sss3TotalPaid = Number(Sss3TotalPaidSchoolFees) + Number(Sss3TotalPaidPtaFees)
                                                        estimatedSss1FeeTotal = (Number(currentSss3Set.firstTerm.schoolFees) + Number(currentSss3Set.firstTerm.ptaFees)) * Number(Sss3StudentNumber)
                                                        Sss3TotalDebt = estimatedSss3FeeTotal - Sss3TotalPaid



                                                    } else if (Sss3StudentNoSecondTerm.length > 0 && Sss3StudentNoThirdTerm === 0) {
                                                        Sss3StudentNumber = Sss3StudentNoSecondTerm.length

                                                        result.map((info) => {
                                                            Sss3TotalPaidSchoolFees += Number(info.sss3.secondTermSchoolFees)
                                                            Sss3TotalPaidPtaFees += Number(info.sss3.secondTermPtaFees)
                                                        })



                                                        Sss3TotalPaid = Number(Sss3TotalPaidSchoolFees) + Number(Sss3TotalPaidPtaFees)
                                                        estimatedSss1FeeTotal = (Number(currentSss3Set.secondTerm.schoolFees) + Number(currentSss3Set.secondTerm.ptaFees)) * Number(Sss3StudentNumber)
                                                        Sss3TotalDebt = estimatedSss3FeeTotal - Sss3TotalPaid

                                                    } else if (Sss3StudentNoThirdTerm.length > 0) {
                                                        Sss3StudentTerm = Sss3StudentNoThirdTerm.length

                                                        result.map((info) => {
                                                            Sss3TotalPaidSchoolFees += Number(info.sss3.thirdTermSchoolFees)
                                                            Sss3TotalPaidPtaFees += Number(info.sss3.thirdTermPtaFees)
                                                        })



                                                        Sss3TotalPaid = Number(Sss3TotalPaidSchoolFees) + Number(Sss3TotalPaidPtaFees)
                                                        estimatedSss1FeeTotal = (Number(currentSss3Set.thirdTerm.schoolFees) + Number(currentSss3Set.thirdTerm.ptaFees)) * Number(Sss3StudentNumber)
                                                        Sss3TotalDebt = estimatedSss3FeeTotal - Sss3TotalPaid
                                                    }





                                                }
                                                const error = false
                                                if (!error) {
                                                    resolve()
                                                } else {
                                                    reject("an error occured")
                                                }
                                            })


                                        })
                                    }

                                }






                                const afterCalculation = async () => {
                                    await calculateJssOne()
                                    await calculateJssTwo()
                                    await calculateJssThree()
                                    await calculateSss1()
                                    await calculateSss2()
                                    await calculateSss3()

                                    if (status) {
                                        res.send({ message: "an error occured", status: false })
                                    } else {
                                        console.log("yessssssssssssssssssssssssssssssssssssssssssssssss")
                                        res.send({
                                            message: "succesful",
                                            status: true,
                                            schoolDetails: schoolDetails,

                                            Jss1TotalNumber: Jss1StudentNumber,
                                            Jss1Set: Jss1Set,
                                            Jss2TotalNumber: Jss2StudentNumber,
                                            Jss2Set: Jss2Set,
                                            Jss3TotalNumber: Jss3StudentNumber,
                                            Jss3Set: Jss3Set,
                                            Sss1TotalNumber: Sss1StudentNumber,
                                            Sss1Set: Sss1Set,
                                            Sss2TotalNumber: Sss2StudentNumber,
                                            Sss2Set: Sss2Set,
                                            Sss3TotalNumber: Sss3StudentNumber,
                                            Sss3Set: Sss3Set,


                                            //Junior Total Paid

                                            JuniorTotalPaid: [
                                                {
                                                    class: "Jss1",
                                                    credit: Jss1TotalPaid
                                                },
                                                {
                                                    class: "Jss2",
                                                    credit: Jss2TotalPaid
                                                },
                                                {
                                                    class: "Jss3",
                                                    credit: Jss3TotalPaid,

                                                },
                                            ],

                                            //Junior Debt
                                            JuniorDebt: [
                                                {
                                                    class: "Jss1",
                                                    debt: Jss1TotalDebt
                                                },
                                                {
                                                    class: "Jss2",
                                                    debt: Jss2TotalDebt
                                                },
                                                {
                                                    class: "Jss3",
                                                    debt: Jss3TotalDebt
                                                },
                                            ],
                                            SenoirTotalPaid: [
                                                {
                                                    class: "Sss1",
                                                    credit: Sss1TotalPaid
                                                },
                                                {
                                                    class: "Sss2",
                                                    credit: Sss2TotalPaid
                                                },
                                                {
                                                    class: "Sss3",
                                                    credit: Sss3TotalPaid
                                                },
                                            ],

                                            //Junior Debt
                                            SenoirDebt: [
                                                {
                                                    class: "Sss1",
                                                    debt: Sss1TotalDebt
                                                },
                                                {
                                                    class: "Sss2",
                                                    debt: Sss2TotalDebt
                                                },
                                                {
                                                    class: "Sss3",
                                                    debt: Sss3TotalDebt
                                                },
                                            ],


                                        })
                                    }
                                }
                                afterCalculation()

                            } else {
                                res.send({
                                    message: "succesful",
                                    status: true,
                                    schoolDetails: schoolDetails,
                                    Jss1TotalNumber: Jss1StudentNumber,
                                    Jss1Set: Jss1Set,
                                    Jss2TotalNumber: Jss2StudentNumber,
                                    Jss2Set: Jss2Set,
                                    Jss3TotalNumber: Jss3StudentNumber,
                                    Jss3Set: Jss3Set,
                                    Sss1TotalNumber: Sss1StudentNumber,
                                    Sss1Set: Sss1Set,
                                    Sss2TotalNumber: Sss2StudentNumber,
                                    Sss2Set: Sss2Set,
                                    Sss3TotalNumber: Sss3StudentNumber,
                                    Sss3Set: Sss3Set,

                                    //Junior Total Paid

                                    JuniorTotalPaid: [
                                        {
                                            class: "Jss1",
                                            credit: Jss1TotalPaid
                                        },
                                        {
                                            class: "Jss2",
                                            credit: Jss2TotalPaid
                                        },
                                        {
                                            class: "Jss3",
                                            credit: Jss3TotalPaid,

                                        },
                                    ],

                                    //Junior Debt
                                    JuniorDebt: [
                                        {
                                            class: "Jss1",
                                            debt: Jss1TotalDebt
                                        },
                                        {
                                            class: "Jss2",
                                            debt: Jss2TotalDebt
                                        },
                                        {
                                            class: "Jss3",
                                            debt: Jss3TotalDebt
                                        },
                                    ],
                                    SenoirTotalPaid: [
                                        {
                                            class: "Sss1",
                                            credit: Sss1TotalPaid
                                        },
                                        {
                                            class: "Sss2",
                                            credit: Sss2TotalPaid
                                        },
                                        {
                                            class: "Sss3",
                                            credit: Sss3TotalPaid
                                        },
                                    ],

                                    //Junior Debt
                                    SenoirDebt: [
                                        {
                                            class: "Sss1",
                                            debt: Sss1TotalDebt
                                        },
                                        {
                                            class: "Sss2",
                                            debt: Sss2TotalDebt
                                        },
                                        {
                                            class: "Sss3",
                                            debt: Sss3TotalDebt
                                        },
                                    ],


                                })
                            }


                        }
                    })

                }
            })


        }
    })


}
const sendGeneralMail = (req, res) => {
    console.log(req.body)
    studentModel.find({ schoolId: req.body.schoolId }, (err, result) => {
        if (err) {
            res.send({ message: "an error occured  ", status: false })
        } else {
            if (result !== null) {
                console.log(result)
                const currentSetStudent = result.filter((info, id) => info.currentSet === req.body.lastestSet)
                console.log(currentSetStudent)
                const thosewithGmail = currentSetStudent.filter((info) => info.parentGmail !== "")
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'skuledman@gmail.com',
                        pass: process.env.appPass,
                    }
                })
                thosewithGmail.map((student) => {
                    var mailOptions = {
                        from: "Skuledman",
                        to: student.parentGmail,
                        subject: req.body.subject,
                        text: '',
                        html: `<div style="background-color:#f8f9fa; width:95%; margin:0 auto; padding:15px 10px;" >
                        <p>${req.body.message}</p>
                        </div>`,
                    }
                    transporter.sendMail(mailOptions, (err, result) => {
                        if (err) {
                            res.send({ message: 'An error occured sending mail', status: false })
                        } else {
                            res.send({ message: "mailsent succesfully", status: true })
                        }
                    })
                })


            }
        }
    })
}

const uploadSchoolImg = (req, res) => {
    cloudinary.v2.uploader.upload(req.body.imgUrl, { public_id: "studentimage" }, (error, result) => {
        if (error) {
            res.send({ message: "an error happened uploading", status: false })
        } else {
            schoolModel.findOne({ _id: req.body.schoolId }, (err, resultt) => {
                if (err) {
                    res.send({ message: "an error occured", status: false })
                } else {
                    if (resultt !== null) {
                        resultt.schoolImgUrl = result.url
                        schoolModel.findByIdAndUpdate({ _id: req.body.schoolId }, resultt, (err) => {
                            if (err) {
                                res.send({ message: "unable to update", status: false })
                            } else {
                                res.send({ message: "image updated succesfully", status: true })
                            }
                        })
                    }
                }
            })
        }

    })

}


const sendOtpToResetPassword = (req, res) => {
    schoolModel.findOne({ schoolEmail: req.body.userEmail }, (err, result) => {
        if (err) {
            res.send({ message: "an error occured", status: false })
        } else {
            if (result !== null) {
                const Otp = req.body.otp1 + "," + req.body.otp2 + "," + req.body.otp3 + "," + req.body.otp4 + "," + req.body.otp5 + "," + req.body.otp6 + "," + result.schoolEmail + "," + result._id
                const usercode = jwt.sign({ pass: Otp }, process.env.RST, { expiresIn: "5hrs" })
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'skuledman@gmail.com',
                        pass: process.env.appPass,
                    }
                })
                var mailOptions = {
                    from: 'Ec',
                    to: `${result.schoolEmail}`,
                    subject: "Skuledman Password Reset Token",
                    text: '',
                    html: `  <h1 style="text-align: center;color:#ff6400;">Eduman</h1>
                    <div style="display:flex; justify-content:center;">
                        <div style="display: flex; padding: 30px 0;">
                            <div className="logo1" style="
                                                width: 20px;
                                                height: 40px;
                                                border: 1px solid #ff6400;
                                                border-radius: 10px 0 10px 0;
                                            ">
                                <div></div>
                                <div></div>
                            </div>
                            <div style="
                                                width: 20px;
                                                height: 40px;
                                                border: 1px solid #ff6400;
                                                border-radius: 0px 10px 0px 10px;
                                            
                                            ">
                                <div style=" border-bottom: 1px solid #ff6400;
                                                height: 5px;
                                                margin-bottom: 5px;
                                                width: 100%;
                                                "></div>
                                <div style=" border-bottom: 1px solid #ff6400;
                                                height: 5px;
                                                margin-bottom: 5px;
                                                width: 100%;
                                                "></div>
                                <div style=" border-bottom: 1px solid #ff6400;
                                                height: 5px;
                                                margin-bottom: 5px;
                                                width: 100%;
                                                "></div>
                                <div style=" border-bottom: 1px solid #ff6400;
                                                height: 5px;
                                                margin-bottom: 5px;
                                                width: 100%;
                                                "></div>
                            </div>
                
                        </div>
                    </div>
                    <p style="text-align: center; font-family: sans-serif;">Your OTP code is </p>
                    <h1 style="color:#ff6400; text-align: center; padding:10px 0;">
                        <span>${req.body.otp1}</span>-<span>${req.body.otp2}</span>-<span>${req.body.otp3}</span>-<span>${req.body.otp4}</span>-<span>${req.body.otp5}</span>-<span>${req.body.otp6}</span>
                    </h1>`
                }
                transporter.sendMail(mailOptions, (err) => {
                    if (err) {
                        res.send({ message: 'Otp not sent succesfully', status: false })
                    } else {
                        res.send({ message: 'otp sent succesfully', status: true, otpCode: usercode, userEmail: result.schoolEmail })

                    }
                })


            }
        }
    })
}

const verifyResetPasswordOtp = (req, res) => {
    jwt.verify(req.body.otp, process.env.RST, (err, result) => {
        if (err) {
            res.send({ message: "an error occured", status: false })
        } else {

            if (Number(result.pass.split(",")[0]) === Number(req.body.otp1) &&
                Number(result.pass.split(",")[1]) === Number(req.body.otp2) &&
                Number(result.pass.split(",")[2]) === Number(req.body.otp3) &&
                Number(result.pass.split(",")[3]) === Number(req.body.otp4) &&
                Number(result.pass.split(",")[4]) === Number(req.body.otp5) &&
                Number(result.pass.split(",")[5]) === Number(req.body.otp6)
            ) {
                res.send({ message: "valid token", status: true })
                console.log("== valid token ===")
            } else {
                res.send({ message: "Invalid token", status: false })
            }
        }
    })

}





const resetPassword = (req, res) => {
    jwt.verify(req.body.otp, process.env.RST, (err, resultJwt) => {
        if (err) {

        } else {
            console.log(resultJwt)
            let status = false
            schoolModel.findById({ _id: resultJwt.pass.split(",")[7] }, (err, result) => {
                if (err) {
                    res.send({ message: "an error occurred" })
                    status = false
                } else {
                    if (result !== null) {
                        const saltRound = 5

                        bcrypt.hash(req.body.newPassword, saltRound, (err, hashedresult) => {
                            if (err) {
                                res.send({ message: "an error occured", status: false })
                                status = false
                            } else {
                                result.schoolPassword = hashedresult
                                console.log(hashedresult)
                                status = true
                                schoolModel.findByIdAndUpdate({ _id: resultJwt.pass.split(",")[7] }, result, (err) => {
                                    if (err) {
                                        res.send({ message: "an error occured", status: false })
                                    } else {
                                        res.send({ message: "password reset succesfully", status: true })
                                        console.log("reset done")
                                    }

                                })

                            }
                        })

                    } else {
                        res.send({ message: "an error occured", status: false })
                    }
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
    dashDetails,
    sendGeneralMail,
    uploadSchoolImg,
    sendOtpToResetPassword,
    verifyResetPasswordOtp,
    resetPassword

}