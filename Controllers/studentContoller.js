const req = require("express/lib/request")
const res = require("express/lib/response")
const { format } = require("express/lib/response")
const mongoose = require("mongoose")
const setSchemaModel = require("../Models/set")
const studentModel = require("../Models/Student")
const cloudinary = require("cloudinary")
cloudinary.config({
    cloud_name: process.env.cloudName,
    api_key: process.env.cloudinaryApiKey,
    api_secret: process.env.cloudinaryApiSecret
});

///Regustering of student for the first time
const registerStudent = (req, res) => {
    let studentForm;
    studentModel.find({ schoolEmail: req.body.schoolEmail }, (err, result) => {
        if (err) {
            res.send({ message: "An error occured", status: false })
        } else {
            if (result.length > 0) {
                let uniqueId = result[result.length - 1].schoolUniqueId + 1
                req.body.schoolUniqueId = uniqueId
                studentForm = new studentModel(req.body)
                studentForm.save((err, result) => {
                    if (err) {
                        res.send({ message: "An error occured", status: false })
                    } else {
                        res.send({ message: "Created Succesfully", status: true })
                    }
                })


            } else {
                studentForm = new studentModel(req.body)
                studentForm.save((err, result) => {
                    if (err) {
                        res.send({ message: "An error occured", status: false })
                    } else {
                        res.send({ message: "Created Succesfully", status: true })
                    }
                })
            }
        }
    })

}



///Searching of student to add
const searchStudentBelowSet = (req, res) => {
    const info = req.headers.authorization.split(" ")[1]
    const details = info.split(",")
    console.log(details)
    studentModel.find({ schoolEmail: details[1] }, (err, result) => {
        if (err) {
            res.send({ message: "an error occured", status: true })
        } else {
            if (result.length > 0) {
                let studentDetails = result.filter((user, id) => {
                    if (user.firstName.toUpperCase().indexOf(details[0].toUpperCase()) > -1
                        || user.middleName.toUpperCase().indexOf(details[0].toUpperCase()) > -1
                        || user.surName.toUpperCase().indexOf(details[0].toUpperCase()) > -1) {
                        return user
                    }
                })
                res.send({ message: "seen user/s", result: studentDetails, status: true })
            } else {
                res.send({ message: "couldn't find student", status: true })
            }
        }
    })

}

//Adding of current student to a new set created
const addStudentToNewSet = (req, res) => {
    studentModel.findOne({ _id: req.body.studentId }, (err, result) => {
        if (err) {
            res.send({ message: "an error occured", status: false })
        } else {
            result.currentClass = req.body.currentClass
            if (req.body.currentClass === "Jss1") {
                result.jss1Id = req.body.setId
                result.jss1.set = req.body.set
                result.jss1.setId = req.body.setId
            } else if (req.body.currentClass === "Jss2") {
                result.jss2Id = req.body.setId
                result.jss2.set = req.body.set
                result.jss2.setId = req.body.setId
            } else if (req.body.currentClass === "Jss3") {
                result.jss3Id = req.body.setId
                result.jss3.set = req.body.set
                result.jss3.setId = req.body.setId
            } else if (req.body.currentClass === "Sss1") {
                result.sss1Id = req.body.setId
                result.sss1.set = req.body.set
                result.sss1.setId = req.body.setId
            } else if (req.body.currentClass === "Sss2") {
                result.sss2Id = req.body.setId
                result.sss2.set = req.body.set
                result.sss2.setId = req.body.setId

            } else if (req.body.currentClass === "Sss3") {
                result.sss3Id = req.body.setId
                result.sss3.set = req.body.set
                result.sss3.setId = req.body.setId
            }
            studentModel.findOneAndUpdate({ _id: req.body.studentId }, result, (err) => {
                if (err) {
                    res.send({ message: "an error ocurred", status: false })
                } else {
                    res.send({ message: "added succesfully", status: true })
                }
            })
        }
    })
}

///Getting of student associated with each set
const getStudent = (req, res) => {
    const detailsToBeUsed = req.headers.authorization.split(",")
    console.log(detailsToBeUsed)
    if (detailsToBeUsed[0] === "Jss1") {
        studentModel.find({ jss1Id: detailsToBeUsed[3] }, (err, result) => {
            if (err) {
                res.send({ message: "an error ocurred", status: false })
            } else {
                res.send({ message: "users-Found", status: true, result: result })
            }
        })
    } else if (detailsToBeUsed[0] === "Jss2") {
        studentModel.find({ jss2Id: detailsToBeUsed[3] }, (err, result) => {
            if (err) {
                res.send({ message: "an error ocurred", status: false })
            } else {
                res.send({ message: "users-Found", status: true, result: result })
            }
        })
    } else if (detailsToBeUsed[0] === "Jss3") {
        studentModel.find({ jss3Id: detailsToBeUsed[3] }, (err, result) => {
            if (err) {
                res.send({ message: "an error ocurred", status: false })
            } else {
                res.send({ message: "users-Found", status: true, result: result })
            }
        })
    } else if (detailsToBeUsed[0] === "Sss1") {
        studentModel.find({ sss1Id: detailsToBeUsed[3] }, (err, result) => {
            if (err) {
                res.send({ message: "an error ocurred", status: false })
            } else {
                res.send({ message: "users-Found", status: true, result: result })
            }
        })
    } else if (detailsToBeUsed[0] === "Sss2") {
        studentModel.find({ sss2Id: detailsToBeUsed[3] }, (err, result) => {
            if (err) {
                res.send({ message: "an error ocurred", status: false })
            } else {
                res.send({ message: "users-Found", status: true, result: result })
            }
        })
    } else if (detailsToBeUsed[0] === "Sss3") {
        studentModel.find({ sss3Id: detailsToBeUsed[3] }, (err, result) => {
            if (err) {
                res.send({ message: "an error ocurred", status: false })
            } else {
                res.send({ message: "users-Found", status: true, result: result })
            }
        })
    }

}

const gettingTheCurrentStudent = (req, res) => {
    let currentClassInfo = {}
    let firstTermSchoolFee = 0
    let secondTermSchoolFee = 0
    let thirdTermSchoolFee = 0
    let firstTermPtaFee = 0
    let secondTermPtaFee = 0
    let thirdTermPtaFee = 0
    const infoComing = req.headers.authorization.split(",")

    studentModel.findOne({ _id: infoComing[1] }, (err, studentFound) => {
        if (err) {
            res.send({ message: "an error occured", status: false })

        } else {

            if (studentFound !== null) {
                if (infoComing[2] === "Jss1") {
                    currentClassInfo = studentFound.jss1
                } else if (infoComing[2] === "Jss2") {
                    currentClassInfo = studentFound.jss2
                } else if (infoComing[2] === "Jss3") {
                    currentClassInfo = studentFound.jss3
                } else if (infoComing[2] === "Sss1") {
                    currentClassInfo = studentFound.sss1
                } else if (infoComing[2] === "Sss2") {
                    currentClassInfo = studentFound.sss2
                } else if (infoComing[2] === "Sss3") {
                    currentClassInfo = studentFound.sss3
                }
                setSchemaModel.findOne({ _id: infoComing[0] }, (err, result) => {
                    if (err) {
                        res.send({ message: "an err occured", status: false })
                    } else {
                        if (result !== null) {
                            firstTermSchoolFee = result.firstTerm.schoolFees
                            secondTermSchoolFee = result.secondTerm.schoolFees
                            thirdTermSchoolFee = result.thirdTerm.schoolFees
                            firstTermPtaFee = result.firstTerm.ptaFees
                            secondTermPtaFee = result.secondTerm.ptaFees,
                                thirdTermPtaFee = result.thirdTerm.ptaFees

                            let totalDebtSchoolFees = 0
                            let totalPtaDebt = 0
                            if (currentClassInfo.firstTermStatus === true) {
                                ///If he attends only first Term
                                totalDebtSchoolFees = firstTermSchoolFee - currentClassInfo.firstTermSchoolFees
                                //Pta
                                totalPtaDebt = firstTermPtaFee - currentClassInfo.firstTermPtaFees
                            } else if (currentClassInfo.firstTermStatus === true && currentClassInfo.secondTermStatus === true) {
                                ///If he attend boths first Term and second term
                                let secondTerm = firstTermSchoolFee + secondTermSchoolFee
                                let studentTermSChoolFees = currentClassInfo.firstTermSchoolFees + currentClassInfo.secondTermSchoolFees
                                totalDebtSchoolFees = secondTerm - studentTermSChoolFees
                                //Pta
                                let ptasecondTerm = firstTermPtaFee + secondTermPtaFee
                                let studentTermPtaFees = currentClassInfo.firstTermPtaFees + currentClassInfo.secondTermPtaFees
                                totalPtaDebt = ptasecondTerm - studentTermPtaFees

                            } else if (currentClassInfo.firstTermStatus === true && currentClassInfo.secondTermStatus === true && currentClassInfo.thirdTermStatus === true) {
                                ////if he attends both firstTerm, secondterm and third term
                                let thirdTerm = firstTermSchoolFee + secondTermSchoolFee + thirdTermSchoolFee
                                let studentTermSChoolFees = currentClassInfo.firstTermSchoolFee + currentClassInfo.secondTermSchoolFee + currentClassInfo.thirdTermSchoolFee
                                totalDebtSchoolFees = thirdTerm - studentTermSChoolFees
                                ////Pta
                                let ptasecondTerm = firstTermPtaFee + secondTermPtaFee + thirdTermPtaFee
                                let studentTermPtaFees = currentClassInfo.firstTermPtaFees + currentClassInfo.secondTermPtaFees + currentClassInfo.thirdTermPtaFees
                                totalPtaDebt = ptasecondTerm - studentTermPtaFees
                            }
                            res.send({
                                message: "studentFound",
                                status: true,
                                totalInfo: studentFound,
                                currentClassInfo: currentClassInfo,
                                totalSchoolFeesDebtOwned: totalDebtSchoolFees,
                                totalPtaDebt: totalPtaDebt,
                                ///the schoolfees to be paid for the term
                                setfirstTermSchoolFees: firstTermSchoolFee,
                                setSecondTermSchoolFees: secondTermSchoolFee,
                                setThirdTermSchoolFees: thirdTermSchoolFee,
                                //Pta fee to paid this for the term
                                setFirstTermPtaFee: firstTermPtaFee,
                                setSecondTermPtaFee: secondTermPtaFee,
                                setThirdTermPtaFee: thirdTermPtaFee

                            })
                        } else {
                            res.send({ message: "result is empty, an info removed", status: false })
                        }
                    }
                })

            }

        }
    })

}

const uploadStudentImg = (req, res) => {
    cloudinary.v2.uploader.upload(req.body.imgUrl, { public_id: "studentimage" }, (error, result) => {
        if (error) {
            res.send({ message: "an error happened uploading", status: false })
        } else {
            studentModel.findOne({ _id: req.body.userId }, (err, resultt) => {
                if (err) {
                    res.send({ message: "an error occured", status: false })
                } else {
                    if (resultt !== null) {
                        resultt.imgUrl = result.url
                        studentModel.findByIdAndUpdate({ _id: req.body.userId }, resultt, (err) => {
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

    });


}

//add parent email and phone number
const saveChanges = (req, res) => {
    studentModel.findOne({ _id: req.body.studentId }, (err, result) => {
        if (err) {
            res.send({ message: "an error occured", status: false })
        } else {
            if (result !== null) {
                result.firstName = req.body.firstName
                result.middleName = req.body.middleName
                result.surName = req.body.surName
                result.parentGmail = req.body.parentGmail
                result.parentPhoneNumber = req.body.parentPhoneNumber
                studentModel.findByIdAndUpdate({ _id: req.body.studentId }, result, (err) => {
                    if (err) {
                        res.send({ message: "unable to save changes", status: false })
                    } else {
                        res.send({ message: "changes made succesfully", status: true })
                    }
                })

            }
        }
    })

}

const activateStatus = (req, res) => {
    studentModel.findOne({ _id: req.body.studentId }, (err, result) => {
        if (err) {
            res.send({ message: "an error occured", status: false })
        } else {
            if (result !== null) {
                if (req.body.class === "Jss1") {
                    if (req.body.term === 1) {
                        result.jss1.firstTermStatus = true
                    } else if (req.body.term === 2) {
                        result.jss1.secondTermStatus = true
                    } else if (req.body.term === 3) {
                        result.jss1.thirdTermStatus = true
                    }


                } else if (req.body.class === "Jss2") {
                    if (req.body.term === 1) {
                        result.jss2.firstTermStatus = true
                    } else if (req.body.term === 2) {
                        result.jss2.secondTermStatus = true
                    } else if (req.body.term === 3) {
                        result.jss2.thirdTermStatus = true
                    }

                } else if (req.body.class === "Jss3") {
                    if (req.body.term === 1) {
                        result.jss3.firstTermStatus = true
                    } else if (req.body.term === 2) {
                        result.jss3.secondTermStatus = true
                    } else if (req.body.term === 3) {
                        result.jss3.thirdTermStatus = true
                    }

                } else if (req.body.class === "Sss1") {
                    if (req.body.term === 1) {
                        result.sss1.firstTermStatus = true
                    } else if (req.body.term === 2) {
                        result.sss1.secondTermStatus = true
                    } else if (req.body.term === 3) {
                        result.sss1.thirdTermStatus = true
                    }

                } else if (req.body.class === "Sss2") {
                    if (req.body.term === 1) {
                        result.sss2.firstTermStatus = true
                    } else if (req.body.term === 2) {
                        result.sss2.secondTermStatus = true
                    } else if (req.body.term === 3) {
                        result.sss2.thirdTermStatus = true
                    }

                } else if (req.body.class === "Sss3") {
                    if (req.body.term === 1) {
                        result.sss3.firstTermStatus = true
                    } else if (req.body.term === 2) {
                        result.sss3.secondTermStatus = true
                    } else if (req.body.term === 3) {
                        result.sss3.thirdTermStatus = true
                    }
                }
                studentModel.findByIdAndUpdate({ _id: req.body.studentId }, result, (err) => {
                    if (err) {
                        res.send({ message: "an error occured, unable to update", status: false })
                    } else {
                        res.send({ message: "updated succesfully", status: true })
                    }
                })
            }
        }
    })

}

const addSchoolFee = (req, res) => {
    studentModel.findOne({ _id: req.body.studentId }, (err, result) => {
        if (err) {
            res.send({ message: "an error occured", status: false })
        } else {
            if (result !== null) {
                if (req.body.class === "Jss1") {
                    if (req.body.term === 1) {
                        result.jss1.firstTermSchoolFees = Number(req.body.fee) + Number(result.jss1.firstTermSchoolFees)
                    } else if (req.body.term === 2) {
                        result.jss1.secondTermSchoolFees = Number(req.body.fee) + Number(result.jss1.secondTermSchoolFees)
                    } else if (req.body.term === 3) {
                        result.jss1.thirdTermSchoolFees = Number(req.body.fee) + Number(result.jss1.thirdTermSchoolFees)
                    }
                } else if (req.body.class === "Jss2") {
                    if (req.body.term === 1) {
                        result.jss2.firstTermSchoolFees = Number(req.body.fee) + Number(result.jss2.firstTermSchoolFees)
                    } else if (req.body.term === 2) {
                        result.jss2.secondTermSchoolFees = Number(req.body.fee) + Number(result.jss2.secondTermSchoolFees)
                    } else if (req.body.term === 3) {
                        result.jss2.thirdTermSchoolFees = Number(req.body.fee) + Number(result.jss2.thirdTermSchoolFees)
                    }
                } else if (req.body.class === "Jss3") {
                    if (req.body.term === 1) {
                        result.jss3.firstTermSchoolFees = Number(req.body.fee) + Number(result.jss3.firstTermSchoolFees)
                    } else if (req.body.term === 2) {
                        result.jss3.secondTermSchoolFees = Number(req.body.fee) + Number(result.jss3.secondTermSchoolFees)
                    } else if (req.body.term === 3) {
                        result.jss3.thirdTermSchoolFees = Number(req.body.fee) + Number(result.jss3.thirdTermSchoolFees)
                    }
                } else if (req.body.class === "Sss1") {
                    if (req.body.term === 1) {
                        result.sss1.firstTermSchoolFees = Number(req.body.fee) + Number(result.sss1.firstTermSchoolFees)
                    } else if (req.body.term === 2) {
                        result.sss1.secondTermSchoolFees = Number(req.body.fee) + Number(result.sss1.secondTermSchoolFees)
                    } else if (req.body.term === 3) {
                        result.sss1.thirdTermSchoolFees = Number(req.body.fee) + Number(result.sss1.thirdTermSchoolFees)
                    }
                } else if (req.body.class === "Sss2") {
                    if (req.body.term === 1) {
                        result.sss2.firstTermSchoolFees = Number(req.body.fee) + Number(result.sss2.firstTermSchoolFees)
                    } else if (req.body.term === 2) {
                        result.sss2.secondTermSchoolFees = Number(req.body.fee) + Number(result.sss2.secondTermSchoolFees)
                    } else if (req.body.term === 3) {
                        result.sss2.thirdTermSchoolFees = Number(req.body.fee) + Number(result.sss2.thirdTermSchoolFees)
                    }
                } else if (req.body.class === "Sss3") {
                    if (req.body.term === 1) {
                        result.sss3.firstTermSchoolFees = Number(req.body.fee) + Number(result.sss3.firstTermSchoolFees)
                    } else if (req.body.term === 2) {
                        result.sss3.secondTermSchoolFees = Number(req.body.fee) + Number(result.sss3.secondTermSchoolFees)
                    } else if (req.body.term === 3) {
                        result.sss3.thirdTermSchoolFees = Number(req.body.fee) + Number(result.sss3.thirdTermSchoolFees)
                    }
                }
                studentModel.findByIdAndUpdate({ _id: req.body.studentId }, result, (err) => {
                    if (err) {
                        res.send({ message: "an error occured", status: false })
                    } else {
                        res.send({ message: "updated succesfully", status: true })
                    }
                })
            }
        }
    })
}

const addPtaFee = (req, res) => {
    studentModel.findOne({ _id: req.body.studentId }, (err, result) => {
        if (err) {
            res.send({ message: "an error occured", status: false })
        } else {
            if (result !== null) {
                if (req.body.class === "Jss1") {
                    if (req.body.term === 1) {
                        result.jss1.firstTermPtaFees = req.body.fee
                    } else if (req.body.term === 2) {
                        result.jss1.secondTermPtaFees = req.body.fee
                    } else if (req.body.term === 3) {
                        result.jss1.thirdTermPtaFees = req.body.fee
                    }
                }

                studentModel.findByIdAndUpdate({ _id: req.body.studentId }, result, (err) => {
                    if (err) {
                        res.send({ message: "an error occured", status: false })
                    } else {
                        res.send({ message: "updated succesfully", status: true })
                    }
                })
            }
        }
    })
}

let errrorMessage = "an error occured"
const trueStatus = true
const falseStatus = false
const addSubject = (req, res) => {

    studentModel.findOne({ _id: req.body.studentId }, (err, result) => {
        if (err) {
            res.send({ message: errrorMessage, status: falseStatus })
        } else {
            if (result !== null) {
                if (req.body.class === "Jss1") {
                    if (req.body.term === 1) {
                        result.jss1.firstTermResult.push(
                            {
                                subject: req.body.subjectName,
                                totalScore: 0,
                                resultNameXResultScore: []
                            }
                        )
                    } else if (req.body.term === 2) {
                        result.jss1.secondTermResult.push(
                            {
                                subject: req.body.subjectName,
                                totalScore: 0,
                                resultNameXResultScore: []
                            }
                        )

                    } else if (req.body.term === 3) {
                        result.jss1.thirdTermResult.push(
                            {
                                subject: req.body.subjectName,
                                totalScore: 0,
                                resultNameXResultScore: []
                            }
                        )

                    }
                } else if (req.body.class === "Jss2") {
                    if (req.body.term === 1) {
                        result.jss2.firstTermResult.push(
                            {
                                subject: req.body.subjectName,
                                totalScore: 0,
                                resultNameXResultScore: []
                            }
                        )
                    } else if (req.body.term === 2) {
                        result.jss2.secondTermResult.push(
                            {
                                subject: req.body.subjectName,
                                totalScore: 0,
                                resultNameXResultScore: []
                            }
                        )

                    } else if (req.body.term === 3) {
                        result.jss2.thirdTermResult.push(
                            {
                                subject: req.body.subjectName,
                                totalScore: 0,
                                resultNameXResultScore: []
                            }
                        )

                    }
                } else if (req.body.class === "Jss3") {
                    if (req.body.term === 1) {
                        result.jss3.firstTermResult.push(
                            {
                                subject: req.body.subjectName,
                                totalScore: 0,
                                resultNameXResultScore: []
                            }
                        )
                    } else if (req.body.term === 2) {
                        result.jss3.secondTermResult.push(
                            {
                                subject: req.body.subjectName,
                                totalScore: 0,
                                resultNameXResultScore: []
                            }
                        )

                    } else if (req.body.term === 3) {
                        result.jss3.thirdTermResult.push(
                            {
                                subject: req.body.subjectName,
                                totalScore: 0,
                                resultNameXResultScore: []
                            }
                        )

                    }
                } else if (req.body.class === "Sss1") {
                    if (req.body.term === 1) {
                        result.sss1.firstTermResult.push(
                            {
                                subject: req.body.subjectName,
                                totalScore: 0,
                                resultNameXResultScore: []
                            }
                        )
                    } else if (req.body.term === 2) {
                        result.sss1.secondTermResult.push(
                            {
                                subject: req.body.subjectName,
                                totalScore: 0,
                                resultNameXResultScore: []
                            }
                        )

                    } else if (req.body.term === 3) {
                        result.sss1.thirdTermResult.push(
                            {
                                subject: req.body.subjectName,
                                totalScore: 0,
                                resultNameXResultScore: []
                            }
                        )

                    }
                } else if (req.body.class === "Sss2") {
                    if (req.body.term === 1) {
                        result.sss2.firstTermResult.push(
                            {
                                subject: req.body.subjectName,
                                totalScore: 0,
                                resultNameXResultScore: []
                            }
                        )
                    } else if (req.body.term === 2) {
                        result.sss2.secondTermResult.push(
                            {
                                subject: req.body.subjectName,
                                totalScore: 0,
                                resultNameXResultScore: []
                            }
                        )

                    } else if (req.body.term === 3) {
                        result.sss2.thirdTermResult.push(
                            {
                                subject: req.body.subjectName,
                                totalScore: 0,
                                resultNameXResultScore: []
                            }
                        )

                    }
                } else if (req.body.class === "Sss3") {
                    if (req.body.term === 1) {
                        result.sss3.firstTermResult.push(
                            {
                                subject: req.body.subjectName,
                                totalScore: 0,
                                resultNameXResultScore: []
                            }
                        )
                    } else if (req.body.term === 2) {
                        result.sss3.secondTermResult.push(
                            {
                                subject: req.body.subjectName,
                                totalScore: 0,
                                resultNameXResultScore: []
                            }
                        )

                    } else if (req.body.term === 3) {
                        result.sss3.thirdTermResult.push(
                            {
                                subject: req.body.subjectName,
                                totalScore: 0,
                                resultNameXResultScore: []
                            }
                        )

                    }
                }
                console.log(result, "yess")
                studentModel.findByIdAndUpdate({ _id: req.body.studentId }, result, (err) => {
                    if (err) {
                        res.send({ message: "an error occured while adding subject", status: false })
                    } else {
                        res.send({ message: "updated, succesfully", status: true })

                    }
                })
            }
        }
    })
}

const addValue = (req, res) => {
    const totalScoreUpdate = 0
    studentModel.findById({ _id: req.body.userInfo.studentId }, (err, result) => {
        if (err) {
            res.send({ message: "an error occured", status: false })
            console.log(err)
        } else {
            if (result !== null) {
                if (req.body.userInfo.class === "Jss1") {
                    if (req.body.userInfo.term === 1) {
                        result.jss1.firstTermResult.map((info, id) => {
                            if (info.subject === req.body.subject) {
                                info.resultNameXResultScore.push(req.body.subjectInfo)
                                info.resultNameXResultScore.map((score, id) => {
                                    totalScoreUpdate += score.valuePoint
                                })
                                info.totalScore = totalScoreUpdate

                            }
                        })

                    } else if (req.body.userInfo.term === 2) {
                        result.jss1.secondTermResult.map((info, id) => {
                            if (info.subject === req.body.subject) {
                                info.resultNameXResultScore.push(req.body.subjectInfo)
                                info.resultNameXResultScore.map((score, id) => {
                                    totalScoreUpdate += score.valuePoint
                                })
                                info.totalScore = totalScoreUpdate

                            }
                        })

                    } else if (req.body.userInfo.term === 3) {
                        result.jss1.thirdTermResult.map((info, id) => {
                            if (info.subject === req.body.subject) {
                                info.resultNameXResultScore.push(req.body.subjectInfo)
                                info.resultNameXResultScore.map((score, id) => {
                                    totalScoreUpdate += score.valuePoint
                                })
                                info.totalScore = totalScoreUpdate

                            }
                        })
                    }
                } else if (req.body.userInfo.class === "Jss2") {
                    if (req.body.userInfo.term === 1) {
                        result.jss2.firstTermResult.map((info, id) => {
                            if (info.subject === req.body.subject) {
                                info.resultNameXResultScore.push(req.body.subjectInfo)
                                info.resultNameXResultScore.map((score, id) => {
                                    totalScoreUpdate += score.valuePoint
                                })
                                info.totalScore = totalScoreUpdate

                            }
                        })
                    } else if (req.body.userInfo.term === 2) {
                        result.jss2.secondTermResult.map((info, id) => {
                            if (info.subject === req.body.subject) {
                                info.resultNameXResultScore.push(req.body.subjectInfo)
                                info.resultNameXResultScore.map((score, id) => {
                                    totalScoreUpdate += score.valuePoint
                                })
                                info.totalScore = totalScoreUpdate

                            }
                        })
                    } else if (req.body.userInfo.term === 3) {
                        result.jss2.thirdTermResult.map((info, id) => {
                            if (info.subject === req.body.subject) {
                                info.resultNameXResultScore.push(req.body.subjectInfo)
                                info.resultNameXResultScore.map((score, id) => {
                                    totalScoreUpdate += score.valuePoint
                                })
                                info.totalScore = totalScoreUpdate

                            }
                        })
                    }
                } else if (req.body.userInfo.class === "Jss3") {
                    if (req.body.userInfo.term === 1) {
                        result.jss3.firstTermResult.map((info, id) => {
                            if (info.subject === req.body.subject) {
                                info.resultNameXResultScore.push(req.body.subjectInfo)
                                info.resultNameXResultScore.map((score, id) => {
                                    totalScoreUpdate += score.valuePoint
                                })
                                info.totalScore = totalScoreUpdate

                            }
                        })
                    } else if (req.body.userInfo.term === 2) {
                        result.jss3.secondTermResult.map((info, id) => {
                            if (info.subject === req.body.subject) {
                                info.resultNameXResultScore.push(req.body.subjectInfo)
                                info.resultNameXResultScore.map((score, id) => {
                                    totalScoreUpdate += score.valuePoint
                                })
                                info.totalScore = totalScoreUpdate

                            }
                        })
                    } else if (req.body.userInfo.term === 3) {
                        result.jss3.thirdTermResult.map((info, id) => {
                            if (info.subject === req.body.subject) {
                                info.resultNameXResultScore.push(req.body.subjectInfo)
                                info.resultNameXResultScore.map((score, id) => {
                                    totalScoreUpdate += score.valuePoint
                                })
                                info.totalScore = totalScoreUpdate

                            }
                        })
                    }
                } else if (req.body.userInfo.class === "Sss1") {
                    if (req.body.userInfo.term === 1) {
                        result.sss1.firstTermResult.map((info, id) => {
                            if (info.subject === req.body.subject) {
                                info.resultNameXResultScore.push(req.body.subjectInfo)
                                info.resultNameXResultScore.map((score, id) => {
                                    totalScoreUpdate += score.valuePoint
                                })
                                info.totalScore = totalScoreUpdate

                            }
                        })
                    } else if (req.body.userInfo.term === 2) {
                        result.sss1.secondTermResult.map((info, id) => {
                            if (info.subject === req.body.subject) {
                                info.resultNameXResultScore.push(req.body.subjectInfo)
                                info.resultNameXResultScore.map((score, id) => {
                                    totalScoreUpdate += score.valuePoint
                                })
                                info.totalScore = totalScoreUpdate

                            }
                        })
                    } else if (req.body.userInfo.term === 3) {
                        result.sss1.thirdTermResult.map((info, id) => {
                            if (info.subject === req.body.subject) {
                                info.resultNameXResultScore.push(req.body.subjectInfo)
                                info.resultNameXResultScore.map((score, id) => {
                                    totalScoreUpdate += score.valuePoint
                                })
                                info.totalScore = totalScoreUpdate

                            }
                        })
                    }
                } else if (req.body.userInfo.class === "Sss2") {
                    if (req.body.userInfo.term === 1) {
                        result.sss2.firstTermResult.map((info, id) => {
                            if (info.subject === req.body.subject) {
                                info.resultNameXResultScore.push(req.body.subjectInfo)
                                info.resultNameXResultScore.map((score, id) => {
                                    totalScoreUpdate += score.valuePoint
                                })
                                info.totalScore = totalScoreUpdate

                            }
                        })
                    } else if (req.body.userInfo.term === 2) {
                        result.sss2.secondTermResult.map((info, id) => {
                            if (info.subject === req.body.subject) {
                                info.resultNameXResultScore.push(req.body.subjectInfo)
                                info.resultNameXResultScore.map((score, id) => {
                                    totalScoreUpdate += score.valuePoint
                                })
                                info.totalScore = totalScoreUpdate

                            }
                        })

                    } else if (req.body.userInfo.term === 3) {
                        result.sss2.thirdTermResult.map((info, id) => {
                            if (info.subject === req.body.subject) {
                                info.resultNameXResultScore.push(req.body.subjectInfo)
                                info.resultNameXResultScore.map((score, id) => {
                                    totalScoreUpdate += score.valuePoint
                                })
                                info.totalScore = totalScoreUpdate

                            }
                        })
                    }
                } else if (req.body.userInfo.class === "Sss3") {
                    if (req.body.userInfo.term === 1) {
                        result.sss3.firstTermResult.map((info, id) => {
                            if (info.subject === req.body.subject) {
                                info.resultNameXResultScore.push(req.body.subjectInfo)
                                info.resultNameXResultScore.map((score, id) => {
                                    totalScoreUpdate += score.valuePoint
                                })
                                info.totalScore = totalScoreUpdate

                            }
                        })
                    } else if (req.body.userInfo.term === 2) {
                        result.sss3.secondTermResult.map((info, id) => {
                            if (info.subject === req.body.subject) {
                                info.resultNameXResultScore.push(req.body.subjectInfo)
                                info.resultNameXResultScore.map((score, id) => {
                                    totalScoreUpdate += score.valuePoint
                                })
                                info.totalScore = totalScoreUpdate

                            }
                        })

                    } else if (req.body.userInfo.term === 3) {
                        result.sss3.thirdTermResult.map((info, id) => {
                            if (info.subject === req.body.subject) {
                                info.resultNameXResultScore.push(req.body.subjectInfo)
                                info.resultNameXResultScore.map((score, id) => {
                                    totalScoreUpdate += score.valuePoint
                                })
                                info.totalScore = totalScoreUpdate

                            }
                        })
                    }
                }
                studentModel.findByIdAndUpdate({ _id: req.body.userInfo.studentId }, result, (err) => {
                    if (err) {
                        res.send({ message: "an error occured, while updating", status: false })
                    } else {
                        res.send({ message: "added succesfully", status: true })
                    }
                })


            } else {
                res.send({ message: "result is empty, an info removed", status: false })
            }
        }
    })
}

const deleteSubject = (req, res) => {
    let newResultArray = []
    studentModel.findOne({ _id: req.body.studentId }, (err, result) => {
        if (err) {
            res.send({ message: "an error occured", status: false })
        } else {
            if (result !== null) {
                if (req.body.studentCurrentClass === "Jss1") {
                    if (req.body.term === 1) {
                        newResultArray = result.jss1.firstTermResult.filter((name, id) => name.subject !== req.body.currentSubject)
                        result.jss1.firstTermResult = newResultArray
                    } else if (req.body.term === 2) {
                        newResultArray = result.jss1.secondTermResult.filter((name, id) => name.subject !== req.body.currentSubject)
                        result.jss1.secondTermResult = newResultArray
                    } else if (req.body.term === 3) {
                        newResultArray = result.jss1.thirdTermResult.filter((name, id) => name.subject !== req.body.currentSubject)
                        result.jss1.thirdTermResult = newResultArray
                    }
                }
                else if (req.body.studentCurrentClass === "Jss2") {
                    if (req.body.term === 1) {
                        newResultArray = result.jss2.firstTermResult.filter((name, id) => name.subject !== req.body.currentSubject)
                        result.jss2.firstTermResult = newResultArray
                    } else if (req.body.term === 2) {
                        newResultArray = result.jss2.secondTermResult.filter((name, id) => name.subject !== req.body.currentSubject)
                        result.jss2.secondTermResult = newResultArray
                    } else if (req.body.term === 3) {
                        newResultArray = result.jss2.thirdTermResult.filter((name, id) => name.subject !== req.body.currentSubject)
                        result.jss2.thirdTermResult = newResultArray
                    }
                } else if (req.body.studentCurrentClass === "Jss3") {
                    if (req.body.term === 1) {
                        newResultArray = result.jss3.firstTermResult.filter((name, id) => name.subject !== req.body.currentSubject)
                        result.jss3.firstTermResult = newResultArray
                    } else if (req.body.term === 2) {
                        newResultArray = result.jss3.secondTermResult.filter((name, id) => name.subject !== req.body.currentSubject)
                        result.jss3.secondTermResult = newResultArray
                    } else if (req.body.term === 3) {
                        newResultArray = result.jss3.thirdTermResult.filter((name, id) => name.subject !== req.body.currentSubject)
                        result.jss3.thirdTermResult = newResultArray
                    }
                } else if (req.body.studentCurrentClass === "Sss1") {
                    if (req.body.term === 1) {
                        newResultArray = result.sss1.firstTermResult.filter((name, id) => name.subject !== req.body.currentSubject)
                        result.sss1.firstTermResult = newResultArray
                    } else if (req.body.term === 2) {
                        newResultArray = result.sss1.secondTermResult.filter((name, id) => name.subject !== req.body.currentSubject)
                        result.sss1.secondTermResult = newResultArray
                    } else if (req.body.term === 3) {
                        newResultArray = result.sss1.thirdTermResult.filter((name, id) => name.subject !== req.body.currentSubject)
                        result.sss1.thirdTermResult = newResultArray
                    }
                } else if (req.body.studentCurrentClass === "Sss2") {
                    if (req.body.term === 1) {
                        newResultArray = result.sss2.firstTermResult.filter((name, id) => name.subject !== req.body.currentSubject)
                        result.sss2.firstTermResult = newResultArray
                    } else if (req.body.term === 2) {
                        newResultArray = result.sss2.thirdTermResult.filter((name, id) => name.subject !== req.body.currentSubject)
                        result.sss2.thirdTermResult = newResultArray
                    } else if (req.body.term === 3) {
                        newResultArray = result.sss2.thirdTermResult.filter((name, id) => name.subject !== req.body.currentSubject)
                        result.sss2.thirdTermResult = newResultArray
                    }
                } else if (req.body.studentCurrentClass === "Sss3") {
                    if (req.body.term === 1) {
                        newResultArray = result.sss3.firstTermResult.filter((name, id) => name.subject !== req.body.currentSubject)
                        result.sss3.firstTermResult = newResultArray
                    } else if (req.body.term === 2) {
                        newResultArray = result.sss3.secondTermResult.filter((name, id) => name.subject !== req.body.currentSubject)
                        result.sss3.secondTermResult = newResultArray
                    } else if (req.body.term === 3) {
                        newResultArray = result.sss3.thirdTermResult.filter((name, id) => name.subject !== req.body.currentSubject)
                        result.sss3.thirdTermResult = newResultArray
                    }
                }
                studentModel.findByIdAndUpdate({ _id: req.body.studentId }, result, (err) => {
                    if (err) {
                        res.send({ message: "an error occured deleting", status: false })
                    } else {
                        res.send({ message: "deleted succesfully", status: true })
                    }
                })
            } else {
                res.send({ message: "an error occured operating command", status: false })
            }
        }
    })

}

const deletingValuePoint = (req, res) => {
    studentModel.findOne({ _id: req.body.studentId }, (err, result) => {
        if (err) {
            res.send({ message: "an error occured", status: false })
        } else {
            if (result !== null) {
                if (req.body.currentClass === "Jss1") {
                    if (req.body.term === 1) {
                        result.jss1.firstTermResult.map((info, id) => {
                            if (info.subject === req.body.currentSubject) {
                                let newScore = info.resultNameXResultScore.filter((point, id) => id !== req.body.valuePointId)
                                info.resultNameXResultScore = newScore
                            }
                        })
                    } else if (req.body.term === 2) {
                        result.jss1.secondTermResult.map((info, id) => {
                            if (info.subject === req.body.currentSubject) {
                                let newScore = info.resultNameXResultScore.filter((point, id) => id !== req.body.valuePointId)
                                info.resultNameXResultScore = newScore
                            }
                        })
                    } else if (req.body.term === 3) {
                        result.jss1.thirdTermResult.map((info, id) => {
                            if (info.subject === req.body.currentSubject) {
                                let newScore = info.resultNameXResultScore.filter((point, id) => id !== req.body.valuePointId)
                                info.resultNameXResultScore = newScore
                            }
                        })
                    }
                } else if (req.body.currentClass === "Jss2") {
                    if (req.body.term === 1) {
                        result.jss2.firstTermResult.map((info, id) => {
                            if (info.subject === req.body.currentSubject) {
                                let newScore = info.resultNameXResultScore.filter((point, id) => id !== req.body.valuePointId)
                                info.resultNameXResultScore = newScore
                            }
                        })
                    } else if (req.body.term === 2) {
                        result.jss2.secondTermResult.map((info, id) => {
                            if (info.subject === req.body.currentSubject) {
                                let newScore = info.resultNameXResultScore.filter((point, id) => id !== req.body.valuePointId)
                                info.resultNameXResultScore = newScore
                            }
                        })
                    } else if (req.body.term === 3) {
                        result.jss2.thirdTermResult.map((info, id) => {
                            if (info.subject === req.body.currentSubject) {
                                let newScore = info.resultNameXResultScore.filter((point, id) => id !== req.body.valuePointId)
                                info.resultNameXResultScore = newScore
                            }
                        })
                    }
                } else if (req.body.currentClass === "Jss3") {
                    if (req.body.term === 1) {
                        result.jss3.firstTermResult.map((info, id) => {
                            if (info.subject === req.body.currentSubject) {
                                let newScore = info.resultNameXResultScore.filter((point, id) => id !== req.body.valuePointId)
                                info.resultNameXResultScore = newScore
                            }
                        })
                    } else if (req.body.term === 2) {
                        result.jss3.secondTermResult.map((info, id) => {
                            if (info.subject === req.body.currentSubject) {
                                let newScore = info.resultNameXResultScore.filter((point, id) => id !== req.body.valuePointId)
                                info.resultNameXResultScore = newScore
                            }
                        })
                    } else if (req.body.term === 3) {
                        result.jss3.thirdTermResult.map((info, id) => {
                            if (info.subject === req.body.currentSubject) {
                                let newScore = info.resultNameXResultScore.filter((point, id) => id !== req.body.valuePointId)
                                info.resultNameXResultScore = newScore
                            }
                        })
                    }
                } else if (req.body.currentClass === "Sss1") {
                    if (req.body.term === 1) {
                        result.sss1.firstTermResult.map((info, id) => {
                            if (info.subject === req.body.currentSubject) {
                                let newScore = info.resultNameXResultScore.filter((point, id) => id !== req.body.valuePointId)
                                info.resultNameXResultScore = newScore
                            }
                        })
                    } else if (req.body.term === 2) {
                        result.sss1.secondTermResult.map((info, id) => {
                            if (info.subject === req.body.currentSubject) {
                                let newScore = info.resultNameXResultScore.filter((point, id) => id !== req.body.valuePointId)
                                info.resultNameXResultScore = newScore
                            }
                        })
                    } else if (req.body.term === 3) {
                        result.sss1.thirdTermResult.map((info, id) => {
                            if (info.subject === req.body.currentSubject) {
                                let newScore = info.resultNameXResultScore.filter((point, id) => id !== req.body.valuePointId)
                                info.resultNameXResultScore = newScore
                            }
                        })
                    }
                } else if (req.body.currentClass === "Sss2") {
                    if (req.body.term === 1) {
                        result.sss2.firstTermResult.map((info, id) => {
                            if (info.subject === req.body.currentSubject) {
                                let newScore = info.resultNameXResultScore.filter((point, id) => id !== req.body.valuePointId)
                                info.resultNameXResultScore = newScore
                            }
                        })
                    } else if (req.body.term === 2) {
                        result.sss2.secondTermResult.map((info, id) => {
                            if (info.subject === req.body.currentSubject) {
                                let newScore = info.resultNameXResultScore.filter((point, id) => id !== req.body.valuePointId)
                                info.resultNameXResultScore = newScore
                            }
                        })
                    } else if (req.body.term === 3) {
                        result.sss2.thirdTermResult.map((info, id) => {
                            if (info.subject === req.body.currentSubject) {
                                let newScore = info.resultNameXResultScore.filter((point, id) => id !== req.body.valuePointId)
                                info.resultNameXResultScore = newScore
                            }
                        })
                    }
                } else if (req.body.currentClass === "Sss3") {
                    if (req.body.term === 1) {
                        result.sss3.firstTermResult.map((info, id) => {
                            if (info.subject === req.body.currentSubject) {
                                let newScore = info.resultNameXResultScore.filter((point, id) => id !== req.body.valuePointId)
                                info.resultNameXResultScore = newScore
                            }
                        })
                    } else if (req.body.term === 2) {
                        result.sss3.secondTermResult.map((info, id) => {
                            if (info.subject === req.body.currentSubject) {
                                let newScore = info.resultNameXResultScore.filter((point, id) => id !== req.body.valuePointId)
                                info.resultNameXResultScore = newScore
                            }
                        })
                    } else if (req.body.term === 3) {
                        result.sss3.thirdTermResult.map((info, id) => {
                            if (info.subject === req.body.currentSubject) {
                                let newScore = info.resultNameXResultScore.filter((point, id) => id !== req.body.valuePointId)
                                info.resultNameXResultScore = newScore
                            }
                        })
                    }
                }
                console.log(result)
                studentModel.findOneAndUpdate({ _id: req.body.studentId }, result, (err) => {
                    if (err) {
                        res.send({ message: "an error occured deleting", status: false })
                    } else {
                        res.send({ message: "deleted succesfully", status: true })
                    }
                })
            }
        }
    })
}



const EditSubject = (req, res) => {
    studentModel.findOne({ _id: req.body.studentId }, (err, result) => {
        if (err) {
            res.send({ message: "an error occured" })
        } else {
            if (result !== null) {
                if (req.body.studentClass === "Jss1") {
                    if (req.body.term === 1) {
                        result.jss1.firstTermResult.map((subject, id) => {
                            if (subject.subject === req.body.subject) {
                                subject.subject = req.body.newSubject
                            }
                        })
                    } else if (req.body.term === 2) {
                        result.jss1.secondTermResult.map((subject, id) => {
                            if (subject.subject === req.body.subject) {
                                subject.subject = req.body.newSubject
                            }
                        })
                    } else if (req.body.term === 3) {
                        result.jss1.thirdTermResult.map((subject, id) => {
                            if (subject.subject === req.body.subject) {
                                subject.subject = req.body.newSubject
                            }
                        })
                    }
                }

                studentModel.findByIdAndUpdate({ _id: req.body.studentId }, result, (err) => {
                    if (err) {
                        res.send({ message: "an error occured updating subject", status: false })
                    } else {
                        res.send({ message: "updated succesfully", status: true })
                    }
                })
            }
        }
    })
}

const editValuePointName = (req, res) => {
    studentModel.findOne({ _id: req.body.studentId }, (err, result) => {
        if (err) {
            res.send({ message: "an error occured" })
        } else {
            if (result !== null) {
                if (req.body.studentClass === "Jss1") {
                    if (req.body.term === 1) {
                        result.jss1.firstTermResult.map((subject, id) => {
                            if (subject.subject === req.body.subject) {
                                subject.resultNameXResultScore[req.body.id].valueName = req.body.newSubject
                            }

                        })
                    } else if (req.body.term === 2) {
                        result.jss1.secondTermResult.map((subject, id) => {
                            if (subject.subject === req.body.subject) {
                                subject.resultNameXResultScore[req.body.id].valueName = req.body.newSubject
                            }

                        })

                    } else if (req.body.term === 3) {
                        result.jss1.thirdTermResult.map((subject, id) => {
                            if (subject.subject === req.body.subject) {
                                subject.resultNameXResultScore[req.body.id].valueName = req.body.newSubject
                            }

                        })

                    }
                }
                studentModel.findByIdAndUpdate({ _id: req.body.studentId }, result, (err) => {
                    if (err) {
                        res.send({ message: "an error occured updating subject", status: false })
                    } else {
                        res.send({ message: "updated succesfully", status: true })
                    }
                })
            }
        }
    })
}

const editValuePoint = (req, res) => {
    studentModel.findOne({ _id: req.body.studentId }, (err, result) => {
        if (err) {
            res.send({ message: "an error occured" })
        } else {
            if (result !== null) {
                if (req.body.studentClass === "Jss1") {
                    if (req.body.term === 1) {
                        result.jss1.firstTermResult.map((subject, id) => {
                            if (subject.subject === req.body.subject) {
                                subject.resultNameXResultScore[req.body.id].valuePoint = req.body.newValuePoint
                            }

                        })
                    } else if (req.body.term === 2) {
                        result.jss1.secondTermResult.map((subject, id) => {
                            if (subject.subject === req.body.subject) {
                                subject.resultNameXResultScore[req.body.id].valuePoint = req.body.newValuePoint
                            }

                        })

                    } else if (req.body.term === 3) {
                        result.jss1.thirdTermResult.map((subject, id) => {
                            if (subject.subject === req.body.subject) {
                                subject.resultNameXResultScore[req.body.id].valuePoint = req.body.newValuePoint
                            }

                        })

                    }
                }
                studentModel.findByIdAndUpdate({ _id: req.body.studentId }, result, (err) => {
                    if (err) {
                        res.send({ message: "an error occured updating subject", status: false })
                    } else {
                        res.send({ message: "updated succesfully", status: true })
                    }
                })
            }
        }
    })
}

module.exports = {
    registerStudent,
    searchStudentBelowSet,
    addStudentToNewSet,
    getStudent,
    gettingTheCurrentStudent,
    uploadStudentImg,
    saveChanges,
    activateStatus,
    addSchoolFee,
    addPtaFee,
    addSubject,
    addValue,
    deleteSubject,
    deletingValuePoint,
    EditSubject,
    editValuePointName,
    editValuePoint


}