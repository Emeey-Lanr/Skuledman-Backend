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
                res.send({ message: "couldn't find student", status: false })
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
            if (result !== null) {
                if (req.body.currentClass === "Jss1") {
                    result.currentClass = req.body.currentClass
                    result.currentSet = req.body.currentSet
                    result.jss1Id = req.body.setId
                    result.jss1.set = req.body.set
                    result.jss1.setId = req.body.setId
                    studentModel.findOneAndUpdate({ _id: req.body.studentId }, result, (err) => {
                        if (err) {
                            res.send({ message: "an error ocurred", status: false })
                        } else {
                            res.send({ message: "added succesfully", status: true })
                        }
                    })
                } else if (req.body.currentClass === "Jss2") {
                    result.currentClass = req.body.currentClass
                    result.currentSet = req.body.currentSet
                    result.jss2Id = req.body.setId
                    result.jss2.set = req.body.set
                    result.jss2.setId = req.body.setId
                    studentModel.findOneAndUpdate({ _id: req.body.studentId }, result, (err) => {
                        if (err) {
                            res.send({ message: "an error ocurred", status: false })
                        } else {
                            res.send({ message: "added succesfully", status: true })
                        }
                    })
                } else if (req.body.currentClass === "Jss3") {
                    result.currentClass = req.body.currentClass
                    result.currentSet = req.body.currentSet
                    result.jss3Id = req.body.setId
                    result.jss3.setId = req.body.setId

                    studentModel.findOneAndUpdate({ _id: req.body.studentId }, result, (err) => {
                        if (err) {
                            res.send({ message: "an error ocurred", status: false })
                        } else {
                            res.send({ message: "added succesfully", status: true })
                        }
                    })
                } else if (req.body.currentClass === "Sss1") {
                    result.currentClass = req.body.currentClass
                    result.currentSet = req.body.currentSet
                    result.sss1Id = req.body.setId
                    result.sss1.set = req.body.set
                    result.sss1.setId = req.body.setId
                    if (req.body.classType === 1) {
                        result.sss1.art = true
                    } else if (req.body.classType === 2) {
                        result.sss1.science = true
                    } else if (req.body.classType === 3) {
                        result.sss1.commercial = true
                    }
                    studentModel.findOneAndUpdate({ _id: req.body.studentId }, result, (err) => {
                        if (err) {
                            res.send({ message: "an error ocurred", status: false })
                        } else {
                            res.send({ message: "added succesfully", status: true })
                        }
                    })
                } else if (req.body.currentClass === "Sss2") {
                    if (req.body.classType === 1) {
                        result.sss2.art = true
                    } else if (req.body.classType === 2) {
                        result.sss2.science = true
                    } else if (req.body.classType === 3) {
                        result.sss2.commercial = true
                    }
                    result.currentClass = req.body.currentClass
                    result.currentSet = req.body.currentSet
                    result.sss2Id = req.body.setId
                    result.sss2.set = req.body.set
                    result.sss2.setId = req.body.setId
                    studentModel.findOneAndUpdate({ _id: req.body.studentId }, result, (err) => {
                        if (err) {
                            res.send({ message: "an error ocurred", status: false })
                        } else {
                            res.send({ message: "added succesfully", status: true })
                        }
                    })

                } else if (req.body.currentClass === "Sss3") {
                    if (req.body.classType === 1) {
                        result.sss3.art = true
                    } else if (req.body.classType === 2) {
                        result.sss3.science = true
                    } else if (req.body.classType === 3) {
                        result.sss3.commercial = true
                    }
                    result.currentClass = req.body.currentClass
                    result.currentSet = req.body.currentSet
                    result.sss3Id = req.body.setId
                    result.sss3.set = req.body.set
                    result.sss3.setId = req.body.setId
                    studentModel.findOneAndUpdate({ _id: req.body.studentId }, result, (err) => {
                        if (err) {
                            res.send({ message: "an error ocurred", status: false })
                        } else {
                            res.send({ message: "added succesfully", status: true })
                        }
                    })
                }
            } else {
                res.send({ message: "an error occured,", status: false })
            }

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
                                if (result.class === "Jss1") {
                                    if (studentFound.jss1.firstTermResult.length === 0) {
                                        studentFound.jss1.firstTermResult = result.firstTerm.juniorSubject
                                    }
                                } else if (result.class === "Jss2") {
                                    if (studentFound.jss2.firstTermResult.length === 0) {
                                        studentFound.jss2.firstTermResult = result.firstTerm.juniorSubject
                                    }
                                } else if (result.class === "Jss3") {
                                    if (studentFound.jss3.firstTermResult.length === 0) {
                                        studentFound.jss3.firstTermResult = result.firstTerm.juniorSubject
                                    }
                                } else if (result.class === "Sss1") {
                                    console.log("yessss")
                                    if (studentFound.sss1.firstTermResult.length === 0) {
                                        console.log(studentFound.sss1.firstTermResult, studentFound.sss1.art, "++++++")
                                        if (studentFound.sss1.science) {
                                            studentFound.sss1.firstTermResult = result.firstTerm.scienceSubject
                                        } else if (studentFound.sss1.art) {
                                            studentFound.sss1.firstTermResult = result.firstTerm.artSubject
                                        } else if (studentFound.sss1.commercial) {
                                            studentFound.sss1.firstTermResult = result.firstTerm.commercialSubject
                                        }
                                    }
                                    console.log(studentFound.sss1.firstTermResult, result.firstTerm.scienceSubject)
                                } else if (result.class === "Sss2") {
                                    if (studentFound.sss2.firstTermResult.length === 0) {
                                        if (studentFound.sss2.science) {
                                            studentFound.sss2.firstTermResult = result.firstTerm.scienceSubject
                                        } else if (studentFound.sss2.art) {
                                            studentFound.sss2.firstTermResult = result.firstTerm.artSubject
                                        } else if (studentFound.sss2.commercial) {
                                            studentFound.sss2.firstTermResult = result.firstTerm.commercialSubject
                                        }
                                    }
                                } else if (result.class === "Sss3") {
                                    if (studentFound.sss3.firstTermResult.length === 0) {
                                        if (studentFound.sss3.science) {
                                            studentFound.sss3.firstTermResult = result.firstTerm.scienceSubject
                                        } else if (studentFound.sss3.art) {
                                            studentFound.sss3.firstTermResult = result.firstTerm.artSubject
                                        } else if (studentFound.sss3.commercial) {
                                            studentFound.sss3.firstTermResult = result.firstTerm.commercialSubject
                                        }
                                    }
                                }

                            } else if (currentClassInfo.firstTermStatus === true && currentClassInfo.secondTermStatus === true) {
                                ///If he attend boths first Term and second term
                                let secondTerm = firstTermSchoolFee + secondTermSchoolFee
                                let studentTermSChoolFees = currentClassInfo.firstTermSchoolFees + currentClassInfo.secondTermSchoolFees
                                totalDebtSchoolFees = secondTerm - studentTermSChoolFees
                                //Pta
                                let ptasecondTerm = firstTermPtaFee + secondTermPtaFee
                                let studentTermPtaFees = currentClassInfo.firstTermPtaFees + currentClassInfo.secondTermPtaFees
                                totalPtaDebt = ptasecondTerm - studentTermPtaFees

                                // Adding subject
                                if (result.class === "Jss1") {
                                    if (studentFound.jss1.secondTermResult.length === 0) {
                                        studentFound.jss1.secondTermResult = result.secondTerm.juniorSubject
                                    }
                                } else if (result.class === "Jss2") {
                                    if (studentFound.jss2.secondTermResult.length === 0) {
                                        studentFound.jss2.secondTermResult = result.secondTerm.juniorSubject
                                    }
                                } else if (result.class === "Jss3") {
                                    if (studentFound.jss3.secondTermResult.length === 0) {
                                        studentFound.jss3.secondTermResult = result.secondTerm.juniorSubject
                                    }
                                } else if (result.class === "Sss1") {
                                    if (studentFound.sss1.secondTermResult.length === 0) {
                                        if (studentFound.sss1.science) {
                                            studentFound.sss1.secondTermResult = result.secondTerm.scienceSubject
                                        } else if (studentFound.sss1.art) {
                                            studentFound.sss1.secondTermResult = result.secondTerm.artSubject
                                        } else if (studentFound.sss1.commercial) {
                                            studentFound.sss1.secondTermResult = result.secondTerm.commercialSubject
                                        }
                                    }
                                } else if (result.class === "Sss2") {
                                    if (studentFound.sss2.secondTermResult.length === 0) {
                                        if (studentFound.sss2.science) {
                                            studentFound.sss2.secondTermResult = result.secondTerm.scienceSubject
                                        } else if (studentFound.sss2.art) {
                                            studentFound.sss2.secondTermResult = result.secondTerm.artSubject
                                        } else if (studentFound.sss2.commercial) {
                                            studentFound.sss2.secondTermResult = result.secondTerm.commercialSubject
                                        }
                                    }
                                } else if (result.class === "Sss3") {
                                    if (studentFound.sss3.secondTermResult.length === 0) {
                                        if (studentFound.sss3.science) {
                                            studentFound.sss3.secondTermResult = result.secondTerm.scienceSubject
                                        } else if (studentFound.sss3.art) {
                                            studentFound.sss3.secondTermResult = result.secondTerm.artSubject
                                        } else if (studentFound.sss3.commercial) {
                                            studentFound.sss3.secondTermResult = result.secondTerm.commercialSubject
                                        }
                                    }
                                }

                            } else if (currentClassInfo.firstTermStatus === true && currentClassInfo.secondTermStatus === true && currentClassInfo.thirdTermStatus === true) {
                                ////if he attends both firstTerm, secondterm and third term
                                let thirdTerm = firstTermSchoolFee + secondTermSchoolFee + thirdTermSchoolFee
                                let studentTermSChoolFees = currentClassInfo.firstTermSchoolFee + currentClassInfo.secondTermSchoolFee + currentClassInfo.thirdTermSchoolFee
                                totalDebtSchoolFees = thirdTerm - studentTermSChoolFees
                                ////Pta
                                let ptasecondTerm = firstTermPtaFee + secondTermPtaFee + thirdTermPtaFee
                                let studentTermPtaFees = currentClassInfo.firstTermPtaFees + currentClassInfo.secondTermPtaFees + currentClassInfo.thirdTermPtaFees
                                totalPtaDebt = ptasecondTerm - studentTermPtaFees

                                if (result.class === "Jss1") {
                                    if (studentFound.jss1.thirdTermResult.length === 0) {
                                        studentFound.jss1.thirdTermResult = result.thirdTerm.juniorSubject
                                    }
                                } else if (result.class === "Jss2") {
                                    if (studentFound.jss2.thirdTermResult.length === 0) {
                                        studentFound.jss2.thirdTermResult = result.thirdTerm.juniorSubject
                                    }
                                } else if (result.class === "Jss3") {
                                    if (studentFound.jss3.thirdTermResult.length === 0) {
                                        studentFound.jss3.thirdTermResult = result.thirdTerm.juniorSubject
                                    }
                                } else if (result.class === "Sss1") {
                                    if (studentFound.sss1.thirdTermResult.length === 0) {
                                        if (studentFound.sss1.science) {
                                            studentFound.sss1.thirdTermResult = result.thirdTerm.scienceSubject
                                        } else if (studentFound.sss1.art) {
                                            studentFound.sss1.thirdTermResult = result.thirdTerm.artSubject
                                        } else if (studentFound.sss1.commercial) {
                                            studentFound.sss1.thirdTermResult = result.thirdTerm.commercialSubject
                                        }
                                    }
                                } else if (result.class === "Sss2") {
                                    if (studentFound.sss2.thirdTermResult.length === 0) {
                                        if (studentFound.sss2.science) {
                                            studentFound.sss2.thirdTermResult = result.thirdTerm.scienceSubject
                                        } else if (studentFound.sss2.art) {
                                            studentFound.sss2.thirdTermResult = result.thirdTerm.artSubject
                                        } else if (studentFound.sss2.commercial) {
                                            studentFound.sss2.thirdTermResult = result.thirdTerm.commercialSubject
                                        }
                                    }
                                } else if (result.class === "Sss3") {
                                    if (studentFound.sss3.secondTermResult.length === 0) {
                                        if (studentFound.sss3.science) {
                                            studentFound.sss3.thirdTermResult = result.thirdTerm.scienceSubject
                                        } else if (studentFound.sss3.art) {
                                            studentFound.sss3.thirdTermResult = result.thirdTerm.artSubject
                                        } else if (studentFound.sss3.commercial) {
                                            studentFound.sss3.thirdTermResult = result.thirdTerm.commercialSubject
                                        }
                                    }
                                }
                            }
                            studentModel.findByIdAndUpdate({ _id: infoComing[1] }, studentFound, (err) => {
                                if (err) {
                                    res.send({ message: "an error occured", status: false })
                                } else {
                                    console.log("updated succesfuuly")
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
                                        setThirdTermPtaFee: thirdTermPtaFee,

                                        gradingsystemFirstTerm: result.firstTerm.gradeSetting,
                                        gradingsystemSecondTerm: result.secondTerm.gradeSetting,
                                        gradingsystemThirdTerm: result.thirdTerm.gradeSetting,

                                    })
                                }
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
                    studentModel.findByIdAndUpdate({ _id: req.body.studentId }, result, (err) => {
                        if (err) {
                            res.send({ message: "an error occured", status: false })
                        } else {
                            res.send({ message: "updated succesfully", status: true })
                        }
                    })
                } else if (req.body.class === "Jss2") {
                    if (req.body.term === 1) {
                        result.jss2.firstTermPtaFees = req.body.fee
                    } else if (req.body.term === 2) {
                        result.jss2.secondTermPtaFees = req.body.fee
                    } else if (req.body.term === 3) {
                        result.jss2.thirdTermPtaFees = req.body.fee
                    }
                    studentModel.findByIdAndUpdate({ _id: req.body.studentId }, result, (err) => {
                        if (err) {
                            res.send({ message: "an error occured", status: false })
                        } else {
                            res.send({ message: "updated succesfully", status: true })
                        }
                    })
                } else if (req.body.class === "Jss3") {
                    if (req.body.term === 1) {
                        result.jss3.firstTermPtaFees = req.body.fee
                    } else if (req.body.term === 2) {
                        result.jss3.secondTermPtaFees = req.body.fee
                    } else if (req.body.term === 3) {
                        result.jss3.thirdTermPtaFees = req.body.fee
                    }
                    studentModel.findByIdAndUpdate({ _id: req.body.studentId }, result, (err) => {
                        if (err) {
                            res.send({ message: "an error occured", status: false })
                        } else {
                            res.send({ message: "updated succesfully", status: true })
                        }
                    })
                } else if (req.body.class === "Sss1") {
                    if (req.body.term === 1) {
                        result.sss1.firstTermPtaFees = req.body.fee
                    } else if (req.body.term === 2) {
                        result.sss1.secondTermPtaFees = req.body.fee
                    } else if (req.body.term === 3) {
                        result.sss1.thirdTermPtaFees = req.body.fee
                    }
                    studentModel.findByIdAndUpdate({ _id: req.body.studentId }, result, (err) => {
                        if (err) {
                            res.send({ message: "an error occured", status: false })
                        } else {
                            res.send({ message: "updated succesfully", status: true })
                        }
                    })
                } else if (req.body.class === "Sss2") {
                    if (req.body.term === 1) {
                        result.sss2.firstTermPtaFees = req.body.fee
                    } else if (req.body.term === 2) {
                        result.sss2.secondTermPtaFees = req.body.fee
                    } else if (req.body.term === 3) {
                        result.sss2.thirdTermPtaFees = req.body.fee
                    }
                    studentModel.findByIdAndUpdate({ _id: req.body.studentId }, result, (err) => {
                        if (err) {
                            res.send({ message: "an error occured", status: false })
                        } else {
                            res.send({ message: "updated succesfully", status: true })
                        }
                    })
                } else if (req.body.class === "Sss3") {
                    if (req.body.term === 1) {
                        result.sss3.firstTermPtaFees = req.body.fee
                    } else if (req.body.term === 2) {
                        result.sss3.secondTermPtaFees = req.body.fee
                    } else if (req.body.term === 3) {
                        result.sss3.thirdTermPtaFees = req.body.fee
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
                let check = []
                let status = false
                if (req.body.class === "Jss1") {
                    if (req.body.term === 1) {
                        check = result.jss1.firstTermResult.filter((info, id) => info.subject.toUpperCase() === req.body.subjectName.toUpperCase())
                        if (check.length > 0) {
                            res.send({ message: "Subject name already exist", status: false })
                            status = false
                        } else {
                            result.jss1.firstTermResult.push(
                                {
                                    subject: req.body.subjectName,
                                    totalScore: 0,
                                    grade: "",
                                    gradeStatus: "",
                                    resultNameXResultScore: []
                                }
                            )
                            status = true
                        }
                    } else if (req.body.term === 2) {
                        check = result.jss1.secondTermResult.filter((info, id) => info.subject.toUpperCase() === req.body.subjectName.toUpperCase())
                        if (check.length > 0) {
                            res.send({ message: "Subject name already exist", status: false })
                            status = false
                        } else {
                            result.jss1.secondTermResult.push(
                                {
                                    subject: req.body.subjectName,
                                    totalScore: 0,
                                    grade: "",
                                    gradeStatus: "",
                                    resultNameXResultScore: []
                                }
                            )
                            status = true
                        }

                    } else if (req.body.term === 3) {
                        check = result.jss1.thirdTermResult.filter((info, id) => info.subject.toUpperCase() === req.body.subjectName.toUpperCase())
                        if (check.length > 0) {
                            res.send({ message: "Subject name already exist", status: false })
                            status = false
                        } else {
                            result.jss1.thirdTermResult.push(
                                {
                                    subject: req.body.subjectName,
                                    totalScore: 0,
                                    grade: "",
                                    gradeStatus: "",
                                    resultNameXResultScore: []
                                }
                            )
                            status = true
                        }

                    }
                } else if (req.body.class === "Jss2") {

                    if (req.body.term === 1) {
                        check = result.jss2.firstTermResult.filter((info, id) => info.subject.toUpperCase() === req.body.subjectName.toUpperCase())
                        if (check.length > 0) {
                            res.send({ message: "Subject name already exist", status: false })
                        } else {
                            result.jss2.firstTermResult.push(
                                {
                                    subject: req.body.subjectName,
                                    totalScore: 0,
                                    grade: "",
                                    gradeStatus: "",
                                    resultNameXResultScore: []
                                }
                            )
                        }
                    } else if (req.body.term === 2) {
                        check = result.jss2.secondTermResult.filter((info, id) => info.subject.toUpperCase() === req.body.subjectName.toUpperCase())
                        if (check.length > 0) {
                            res.send({ message: "Subject name already exist", status: false })
                        } else {
                            result.jss2.secondTermResult.push(
                                {
                                    subject: req.body.subjectName,
                                    totalScore: 0,
                                    grade: "",
                                    gradeStatus: "",
                                    resultNameXResultScore: []
                                }
                            )
                        }

                    } else if (req.body.term === 3) {
                        check = result.jss2.thirdTermResult.filter((info, id) => info.subject.toUpperCase() === req.body.subjectName.toUpperCase())
                        if (check.length > 0) {
                            res.send({ message: "Subject name already exist", status: false })
                            status = false
                        } else {
                            result.jss2.thirdTermResult.push(
                                {
                                    subject: req.body.subjectName,
                                    totalScore: 0,
                                    grade: "",
                                    gradeStatus: "",
                                    resultNameXResultScore: []
                                }
                            )
                            status = true
                        }

                    }
                } else if (req.body.class === "Jss3") {
                    if (req.body.term === 1) {
                        check = result.jss3.firstTermResult.filter((info, id) => info.subject.toUpperCase() === req.body.subjectName.toUpperCase())
                        if (check.length > 0) {
                            res.send({ message: "Subject name already exist", status: false })
                            status = false
                        } else {
                            result.jss3.firstTermResult.push(
                                {
                                    subject: req.body.subjectName,
                                    totalScore: 0,
                                    grade: "",
                                    gradeStatus: "",
                                    resultNameXResultScore: []
                                }
                            )
                            status = true
                        }
                    } else if (req.body.term === 2) {
                        check = result.jss3.secondTermResult.filter((info, id) => info.subject.toUpperCase() === req.body.subjectName.toUpperCase())
                        if (check.length > 0) {
                            res.send({ message: "Subject name already exist", status: false })
                            status = false
                        } else {
                            result.jss3.secondTermResult.push(
                                {
                                    subject: req.body.subjectName,
                                    totalScore: 0,
                                    grade: "",
                                    gradeStatus: "",
                                    resultNameXResultScore: []
                                }
                            )
                            status = true
                        }

                    } else if (req.body.term === 3) {
                        check = result.jss3.thirdTermResult.filter((info, id) => info.subject.toUpperCase() === req.body.subjectName.toUpperCase())
                        if (check.length > 0) {
                            res.send({ message: "Subject name already exist", status: false })
                            status = false
                        } else {
                            result.jss3.thirdTermResult.push(
                                {
                                    subject: req.body.subjectName,
                                    totalScore: 0,
                                    grade: "",
                                    gradeStatus: "",
                                    resultNameXResultScore: []
                                }

                            )
                            status = true
                        }

                    }
                } else if (req.body.class === "Sss1") {
                    if (req.body.term === 1) {
                        check = result.sss1.firstTermResult.filter((info, id) => info.subject.toUpperCase() === req.body.subjectName.toUpperCase())
                        if (check.length > 0) {
                            res.send({ message: "Subject name already exist", status: false })
                            status = false
                        } else {
                            result.sss1.firstTermResult.push(
                                {
                                    subject: req.body.subjectName,
                                    totalScore: 0,
                                    grade: "",
                                    gradeStatus: "",
                                    resultNameXResultScore: []
                                }
                            )
                            status = true
                        }
                    } else if (req.body.term === 2) {
                        check = result.sss1.secondTermResult.filter((info, id) => info.subject.toUpperCase() === req.body.subjectName.toUpperCase())
                        if (check.length > 0) {
                            res.send({ message: "Subject name already exist", status: false })
                            status = false
                        } else {
                            result.sss1.secondTermResult.push(
                                {
                                    subject: req.body.subjectName,
                                    totalScore: 0,
                                    grade: "",
                                    gradeStatus: "",
                                    resultNameXResultScore: []
                                }
                            )
                            status = true
                        }

                    } else if (req.body.term === 3) {
                        check = result.sss1.thirdTermResult.filter((info, id) => info.subject.toUpperCase() === req.body.subjectName.toUpperCase())
                        if (check.length > 0) {
                            res.send({ message: "Subject name already exist", status: false })
                            status = false
                        } else {
                            result.sss1.thirdTermResult.push(
                                {
                                    subject: req.body.subjectName,
                                    totalScore: 0,
                                    grade: "",
                                    gradeStatus: "",
                                    resultNameXResultScore: []
                                }
                            )
                            status = true
                        }

                    }
                } else if (req.body.class === "Sss2") {
                    if (req.body.term === 1) {
                        check = result.sss2.firstTermResult.filter((info, id) => info.subject.toUpperCase() === req.body.subjectName.toUpperCase())
                        if (check.length > 0) {
                            res.send({ message: "Subject name already exist", status: false })
                            status = false
                        } else {
                            result.sss2.firstTermResult.push(
                                {
                                    subject: req.body.subjectName,
                                    totalScore: 0,
                                    grade: "",
                                    gradeStatus: "",
                                    resultNameXResultScore: []
                                }
                            )
                            status = true
                        }
                    } else if (req.body.term === 2) {
                        check = result.sss2.secondTermResult.filter((info, id) => info.subject.toUpperCase() === req.body.subjectName.toUpperCase())
                        if (check.length > 0) {
                            res.send({ message: "Subject name already exist", status: false })
                            status = false
                        } else {
                            result.sss2.secondTermResult.push(
                                {
                                    subject: req.body.subjectName,
                                    totalScore: 0,
                                    grade: "",
                                    gradeStatus: "",
                                    resultNameXResultScore: []
                                }
                            )
                            status = true
                        }

                    } else if (req.body.term === 3) {
                        check = result.sss2.thirdTermResult.filter((info, id) => info.subject.toUpperCase() === req.body.subjectName.toUpperCase())
                        if (check.length > 0) {
                            res.send({ message: "Subject name already exist", status: false })
                            status = false
                        } else {
                            result.sss2.thirdTermResult.push(
                                {
                                    subject: req.body.subjectName,
                                    totalScore: 0,
                                    grade: "",
                                    gradeStatus: "",
                                    resultNameXResultScore: []
                                }
                            )
                            status = true
                        }
                    }
                } else if (req.body.class === "Sss3") {
                    if (req.body.term === 1) {
                        check = result.sss3.firstTermResult.filter((info, id) => info.subject.toUpperCase() === req.body.subjectName.toUpperCase())
                        if (check.length > 0) {
                            res.send({ message: "Subject name already exist", status: false })
                            status = false
                        } else {
                            result.sss3.firstTermResult.push(
                                {
                                    subject: req.body.subjectName,
                                    totalScore: 0,
                                    grade: "",
                                    gradeStatus: "",
                                    resultNameXResultScore: []
                                }
                            )
                            status = true
                        }
                    } else if (req.body.term === 2) {
                        check = result.sss3.secondTermResult.filter((info, id) => info.subject.toUpperCase() === req.body.subjectName.toUpperCase())
                        if (check.length > 0) {
                            res.send({ message: "Subject name already exist", status: false })
                            status = false
                        } else {
                            result.sss3.secondTermResult.push(
                                {
                                    subject: req.body.subjectName,
                                    totalScore: 0,
                                    grade: "",
                                    gradeStatus: "",
                                    resultNameXResultScore: []
                                }
                            )
                            status = true
                        }

                    } else if (req.body.term === 3) {
                        check = result.sss3.thirdTermResult.filter((info, id) => info.subject.toUpperCase() === req.body.subjectName.toUpperCase())
                        if (check.length > 0) {
                            res.send({ message: "Subject name already exist", status: false })
                            status = false
                        } else {
                            result.sss3.thirdTermResult.push(
                                {
                                    subject: req.body.subjectName,
                                    totalScore: 0,
                                    grade: "",
                                    gradeStatus: "",
                                    resultNameXResultScore: []
                                }
                            )
                            status = true

                        }

                    }
                } else {
                    status = false
                    res.send({ message: "an error occured", status: false })
                }

                if (status) {
                    studentModel.findByIdAndUpdate({ _id: req.body.studentId }, result, (err) => {
                        if (err) {
                            res.send({ message: "an error occured while adding subject", status: false })
                        } else {
                            res.send({ message: "updated, succesfully", status: true })

                        }
                    })
                }


            }
        }
    })
}

const addValue = (req, res) => {
    let totalScoreUpdate = 0
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
                                    totalScoreUpdate += Number(score.valuePoint)
                                })
                                info.totalScore = totalScoreUpdate

                                if (info.totalScore >= req.body.firstGrade.A1[0] && info.totalScore <= req.body.firstGrade.A1[1]) {
                                    info.grade = "A1"
                                    info.gradeStatus = "Excellent"
                                } else if (info.totalScore >= req.body.firstGrade.B2[0] && info.totalScore <= req.body.firstGrade.B2[1]) {
                                    info.grade = "B2"
                                    info.gradeStatus = "Very Good"
                                } else if (info.totalScore >= req.body.firstGrade.B3[0] && info.totalScore <= req.body.firstGrade.B3[1]) {
                                    info.grade = "B3"
                                    info.gradeStatus = "Good"
                                } else if (info.totalScore >= req.body.firstGrade.C4[0] && info.totalScore <= req.body.firstGrade.C4[1]) {
                                    info.grade = "C4"
                                    info.gradeStatus = "Credit"
                                } else if (info.totalScore >= req.body.firstGrade.C5[0] && info.totalScore <= req.body.firstGrade.C5[1]) {
                                    info.grade = "C5"
                                    info.gradeStatus = "Credit"
                                } else if (info.totalScore >= req.body.firstGrade.C6[0] && info.totalScore <= req.body.firstGrade.C6[1]) {
                                    info.grade = "C6"
                                    info.gradeStatus = "Credit"
                                } else if (info.totalScore >= req.body.firstGrade.D7[0] && info.totalScore <= req.body.firstGrade.D7[1]) {
                                    info.grade = "D7"
                                    info.gradeStatus = "Pass"
                                } else if (info.totalScore >= req.body.firstGrade.E8[0] && info.totalScore <= req.body.firstGrade.E8[1]) {
                                    info.grade = "E8"
                                    info.gradeStatus = "Pass"
                                } else if (info.totalScore >= req.body.firstGrade.F9[0] && info.totalScore <= req.body.firstGrade.F9[1]) {
                                    info.grade = "F9"
                                    info.gradeStatus = "Fail"
                                }


                            }
                        })

                    } else if (req.body.userInfo.term === 2) {
                        result.jss1.secondTermResult.map((info, id) => {
                            if (info.subject === req.body.subject) {
                                info.resultNameXResultScore.push(req.body.subjectInfo)
                                info.resultNameXResultScore.map((score, id) => {
                                    totalScoreUpdate += Number(score.valuePoint)
                                })
                                info.totalScore = totalScoreUpdate
                                if (info.totalScore >= req.body.secondGrade.A1[0] && info.totalScore <= req.body.secondGrade.A1[1]) {
                                    info.grade = "A1"
                                    info.gradeStatus = "Excellent"
                                } else if (info.totalScore >= req.body.secondGrade.B2[0] && info.totalScore <= req.body.secondGrade.B2[1]) {
                                    info.grade = "B2"
                                    info.gradeStatus = "Very Good"
                                } else if (info.totalScore >= req.body.secondGrade.B3[0] && info.totalScore <= req.body.secondGrade.B3[1]) {
                                    info.grade = "B3"
                                    info.gradeStatus = "Good"
                                } else if (info.totalScore >= req.body.secondGrade.C4[0] && info.totalScore <= req.body.secondGrade.C4[1]) {
                                    info.grade = "C4"
                                    info.gradeStatus = "Credit"
                                } else if (info.totalScore >= req.body.secondGrade.C5[0] && info.totalScore <= req.body.secondGrade.C5[1]) {
                                    info.grade = "C5"
                                    info.gradeStatus = "Credit"
                                } else if (info.totalScore >= req.body.secondGrade.C6[0] && info.totalScore <= req.body.secondGrade.C6[1]) {
                                    info.grade = "C6"
                                    info.gradeStatus = "Credit"
                                } else if (info.totalScore >= req.body.secondGrade.D7[0] && info.totalScore <= req.body.secondGrade.D7[1]) {
                                    info.grade = "D7"
                                    info.gradeStatus = "Pass"
                                } else if (info.totalScore >= req.body.secondGrade.E8[0] && info.totalScore <= req.body.secondGrade.E8[1]) {
                                    info.grade = "E8"
                                    info.gradeStatus = "Pass"
                                } else if (info.totalScore >= req.body.secondGrade.F9[0] && info.totalScore <= req.body.secondGrade.F9[1]) {
                                    info.grade = "F9"
                                    info.gradeStatus = "Fail"
                                }

                            }
                        })

                    } else if (req.body.userInfo.term === 3) {
                        result.jss1.thirdTermResult.map((info, id) => {
                            if (info.subject === req.body.subject) {
                                info.resultNameXResultScore.push(req.body.subjectInfo)
                                info.resultNameXResultScore.map((score, id) => {
                                    totalScoreUpdate += Number(score.valuePoint)
                                })
                                info.totalScore = totalScoreUpdate
                                if (info.totalScore >= req.body.thirdGrade.A1[0] && info.totalScore <= req.body.thirdGrade.A1[1]) {
                                    info.grade = "A1"
                                    info.gradeStatus = "Excellent"
                                } else if (info.totalScore >= req.body.thirdGrade.B2[0] && info.totalScore <= req.body.thirdGrade.B2[1]) {
                                    info.grade = "B2"
                                    info.gradeStatus = "Very Good"
                                } else if (info.totalScore >= req.body.thirdGrade.B3[0] && info.totalScore <= req.body.thirdGrade.B3[1]) {
                                    info.grade = "B3"
                                    info.gradeStatus = "Good"
                                } else if (info.totalScore >= req.body.thirdGrade.C4[0] && info.totalScore <= req.body.thirdGrade.C4[1]) {
                                    info.grade = "C4"
                                    info.gradeStatus = "Credit"
                                } else if (info.totalScore >= req.body.thirdGrade.C5[0] && info.totalScore <= req.body.thirdGrade.C5[1]) {
                                    info.grade = "C5"
                                    info.gradeStatus = "Credit"
                                } else if (info.totalScore >= req.body.thirdGrade.C6[0] && info.totalScore <= req.body.thirdGrade.C6[1]) {
                                    info.grade = "C6"
                                    info.gradeStatus = "Credit"
                                } else if (info.totalScore >= req.body.thirdGrade.D7[0] && info.totalScore <= req.body.thirdGrade.D7[1]) {
                                    info.grade = "D7"
                                    info.gradeStatus = "Pass"
                                } else if (info.totalScore >= req.body.thirdGrade.E8[0] && info.totalScore <= req.body.thirdGrade.E8[1]) {
                                    info.grade = "E8"
                                    info.gradeStatus = "Pass"
                                } else if (info.totalScore >= req.body.thirdGrade.F9[0] && info.totalScore <= req.body.thirdGrade.F9[1]) {
                                    info.grade = "F9"
                                    info.gradeStatus = "Fail"
                                }

                            }
                        })
                    }
                } else if (req.body.userInfo.class === "Jss2") {
                    if (req.body.userInfo.term === 1) {
                        result.jss2.firstTermResult.map((info, id) => {
                            if (info.subject === req.body.subject) {
                                info.resultNameXResultScore.push(req.body.subjectInfo)
                                info.resultNameXResultScore.map((score, id) => {
                                    totalScoreUpdate += Number(score.valuePoint)
                                })
                                info.totalScore = totalScoreUpdate

                            }
                        })
                    } else if (req.body.userInfo.term === 2) {
                        result.jss2.secondTermResult.map((info, id) => {
                            if (info.subject === req.body.subject) {
                                info.resultNameXResultScore.push(req.body.subjectInfo)
                                info.resultNameXResultScore.map((score, id) => {
                                    totalScoreUpdate += Number(score.valuePoint)
                                })
                                info.totalScore = totalScoreUpdate

                            }
                        })
                    } else if (req.body.userInfo.term === 3) {
                        result.jss2.thirdTermResult.map((info, id) => {
                            if (info.subject === req.body.subject) {
                                info.resultNameXResultScore.push(req.body.subjectInfo)
                                info.resultNameXResultScore.map((score, id) => {
                                    totalScoreUpdate += Number(score.valuePoint)
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
                                    totalScoreUpdate += Number(score.valuePoint)
                                })
                                info.totalScore = totalScoreUpdate

                            }
                        })
                    } else if (req.body.userInfo.term === 2) {
                        result.jss3.secondTermResult.map((info, id) => {
                            if (info.subject === req.body.subject) {
                                info.resultNameXResultScore.push(req.body.subjectInfo)
                                info.resultNameXResultScore.map((score, id) => {
                                    totalScoreUpdate += Number(score.valuePoint)
                                })
                                info.totalScore = totalScoreUpdate

                            }
                        })
                    } else if (req.body.userInfo.term === 3) {
                        result.jss3.thirdTermResult.map((info, id) => {
                            if (info.subject === req.body.subject) {
                                info.resultNameXResultScore.push(req.body.subjectInfo)
                                info.resultNameXResultScore.map((score, id) => {
                                    totalScoreUpdate += Number(score.valuePoint)
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
                                    totalScoreUpdate += Number(score.valuePoint)
                                })
                                info.totalScore = totalScoreUpdate

                            }
                        })
                    } else if (req.body.userInfo.term === 2) {
                        result.sss1.secondTermResult.map((info, id) => {
                            if (info.subject === req.body.subject) {
                                info.resultNameXResultScore.push(req.body.subjectInfo)
                                info.resultNameXResultScore.map((score, id) => {
                                    totalScoreUpdate += Number(score.valuePoint)
                                })
                                info.totalScore = totalScoreUpdate

                            }
                        })
                    } else if (req.body.userInfo.term === 3) {
                        result.sss1.thirdTermResult.map((info, id) => {
                            if (info.subject === req.body.subject) {
                                info.resultNameXResultScore.push(req.body.subjectInfo)
                                info.resultNameXResultScore.map((score, id) => {
                                    totalScoreUpdate += Number(score.valuePoint)
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
                                    totalScoreUpdate += Number(score.valuePoint)
                                })
                                info.totalScore = totalScoreUpdate

                            }
                        })
                    } else if (req.body.userInfo.term === 2) {
                        result.sss2.secondTermResult.map((info, id) => {
                            if (info.subject === req.body.subject) {
                                info.resultNameXResultScore.push(req.body.subjectInfo)
                                info.resultNameXResultScore.map((score, id) => {
                                    totalScoreUpdate += Number(score.valuePoint)
                                })
                                info.totalScore = totalScoreUpdate

                            }
                        })

                    } else if (req.body.userInfo.term === 3) {
                        result.sss2.thirdTermResult.map((info, id) => {
                            if (info.subject === req.body.subject) {
                                info.resultNameXResultScore.push(req.body.subjectInfo)
                                info.resultNameXResultScore.map((score, id) => {
                                    totalScoreUpdate += Number(score.valuePoint)
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
                                    totalScoreUpdate += Number(score.valuePoint)
                                })
                                info.totalScore = totalScoreUpdate

                            }
                        })
                    } else if (req.body.userInfo.term === 2) {
                        result.sss3.secondTermResult.map((info, id) => {
                            if (info.subject === req.body.subject) {
                                info.resultNameXResultScore.push(req.body.subjectInfo)
                                info.resultNameXResultScore.map((score, id) => {
                                    totalScoreUpdate += Number(score.valuePoint)
                                })
                                info.totalScore = totalScoreUpdate

                            }
                        })

                    } else if (req.body.userInfo.term === 3) {
                        result.sss3.thirdTermResult.map((info, id) => {
                            if (info.subject === req.body.subject) {
                                info.resultNameXResultScore.push(req.body.subjectInfo)
                                info.resultNameXResultScore.map((score, id) => {
                                    totalScoreUpdate += Number(score.valuePoint)
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
            return res.send({ message: "an error occured", status: false })
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
                                let totalscore = Number(info.resultNameXResultScore[req.body.valuePointId].valuePoint)
                                info.totalScore = Number(info.totalScore) - totalscore

                                if (info.totalScore >= req.body.firstGrade.A1[0] && info.totalScore <= req.body.firstGrade.A1[1]) {
                                    subject.grade = "A1"
                                    subject.gradeStatus = "Excellent"
                                } else if (info.totalScore >= req.body.firstGrade.B2[0] && info.totalScore <= req.body.firstGrade.B2[1]) {
                                    info.grade = "B2"
                                    info.gradeStatus = "Very Good"
                                } else if (info.totalScore >= req.body.firstGrade.B3[0] && info.totalScore <= req.body.firstGrade.B3[1]) {
                                    info.grade = "B3"
                                    info.gradeStatus = "Good"
                                } else if (info.totalScore >= req.body.firstGrade.C4[0] && info.totalScore <= req.body.firstGrade.C4[1]) {
                                    info.grade = "C4"
                                    info.gradeStatus = "Credit"
                                } else if (info.totalScore >= req.body.firstGrade.C5[0] && info.totalScore <= req.body.firstGrade.C5[1]) {
                                    info.grade = "C5"
                                    info.gradeStatus = "Credit"
                                } else if (info.totalScore >= req.body.firstGrade.C6[0] && info.totalScore <= req.body.firstGrade.C6[1]) {
                                    info.grade = "C6"
                                    info.gradeStatus = "Credit"
                                } else if (info.totalScore >= req.body.firstGrade.D7[0] && info.totalScore <= req.body.firstGrade.D7[1]) {
                                    info.grade = "D7"
                                    info.gradeStatus = "Pass"
                                } else if (info.totalScore >= req.body.firstGrade.E8[0] && info.totalScore <= req.body.firstGrade.E8[1]) {
                                    info.grade = "E8"
                                    info.gradeStatus = "Pass"
                                } else if (info.totalScore >= req.body.firstGrade.F9[0] && info.totalScore <= req.body.firstGrade.F9[1]) {
                                    info.grade = "F9"
                                    info.gradeStatus = "Fail"
                                }

                                let newScore = info.resultNameXResultScore.filter((point, id) => id !== req.body.valuePointId)
                                info.resultNameXResultScore = newScore


                            }
                        })
                    } else if (req.body.term === 2) {
                        result.jss1.secondTermResult.map((info, id) => {
                            if (info.subject === req.body.currentSubject) {
                                let totalscore = Number(info.resultNameXResultScore[req.body.valuePointId].valuePoint)
                                info.totalScore = Number(info.totalScore) - totalscore

                                if (info.totalScore >= req.body.firstGrade.A1[0] && info.totalScore <= req.body.firstGrade.A1[1]) {
                                    subject.grade = "A1"
                                    subject.gradeStatus = "Excellent"
                                } else if (info.totalScore >= req.body.firstGrade.B2[0] && info.totalScore <= req.body.firstGrade.B2[1]) {
                                    info.grade = "B2"
                                    info.gradeStatus = "Very Good"
                                } else if (info.totalScore >= req.body.firstGrade.B3[0] && info.totalScore <= req.body.firstGrade.B3[1]) {
                                    info.grade = "B3"
                                    info.gradeStatus = "Good"
                                } else if (info.totalScore >= req.body.firstGrade.C4[0] && info.totalScore <= req.body.firstGrade.C4[1]) {
                                    info.grade = "C4"
                                    info.gradeStatus = "Credit"
                                } else if (info.totalScore >= req.body.firstGrade.C5[0] && info.totalScore <= req.body.firstGrade.C5[1]) {
                                    info.grade = "C5"
                                    info.gradeStatus = "Credit"
                                } else if (info.totalScore >= req.body.firstGrade.C6[0] && info.totalScore <= req.body.firstGrade.C6[1]) {
                                    info.grade = "C6"
                                    info.gradeStatus = "Credit"
                                } else if (info.totalScore >= req.body.firstGrade.D7[0] && info.totalScore <= req.body.firstGrade.D7[1]) {
                                    info.grade = "D7"
                                    info.gradeStatus = "Pass"
                                } else if (info.totalScore >= req.body.firstGrade.E8[0] && info.totalScore <= req.body.firstGrade.E8[1]) {
                                    info.grade = "E8"
                                    info.gradeStatus = "Pass"
                                } else if (info.totalScore >= req.body.firstGrade.F9[0] && info.totalScore <= req.body.firstGrade.F9[1]) {
                                    info.grade = "F9"
                                    info.gradeStatus = "Fail"
                                }

                                let newScore = info.resultNameXResultScore.filter((point, id) => id !== req.body.valuePointId)
                                info.resultNameXResultScore = newScore
                            }
                        })
                    } else if (req.body.term === 3) {
                        result.jss1.thirdTermResult.map((info, id) => {
                            if (info.subject === req.body.currentSubject) {
                                let totalscore = Number(info.resultNameXResultScore[req.body.valuePointId].valuePoint)
                                info.totalScore = Number(info.totalScore) - totalscore

                                let newScore = info.resultNameXResultScore.filter((point, id) => id !== req.body.valuePointId)
                                info.resultNameXResultScore = newScore
                            }
                        })
                    }
                } else if (req.body.currentClass === "Jss2") {
                    if (req.body.term === 1) {
                        result.jss2.firstTermResult.map((info, id) => {
                            if (info.subject === req.body.currentSubject) {
                                let totalscore = Number(info.resultNameXResultScore[req.body.valuePointId].valuePoint)
                                info.totalScore = Number(info.totalScore) - totalscore

                                let newScore = info.resultNameXResultScore.filter((point, id) => id !== req.body.valuePointId)
                                info.resultNameXResultScore = newScore
                            }
                        })
                    } else if (req.body.term === 2) {
                        result.jss2.secondTermResult.map((info, id) => {
                            if (info.subject === req.body.currentSubject) {
                                let totalscore = Number(info.resultNameXResultScore[req.body.valuePointId].valuePoint)
                                info.totalScore = Number(info.totalScore) - totalscore

                                let newScore = info.resultNameXResultScore.filter((point, id) => id !== req.body.valuePointId)
                                info.resultNameXResultScore = newScore
                            }
                        })
                    } else if (req.body.term === 3) {
                        result.jss2.thirdTermResult.map((info, id) => {
                            if (info.subject === req.body.currentSubject) {
                                let totalscore = Number(info.resultNameXResultScore[req.body.valuePointId].valuePoint)
                                info.totalScore = Number(info.totalScore) - totalscore

                                let newScore = info.resultNameXResultScore.filter((point, id) => id !== req.body.valuePointId)
                                info.resultNameXResultScore = newScore
                            }
                        })
                    }
                } else if (req.body.currentClass === "Jss3") {
                    if (req.body.term === 1) {
                        result.jss3.firstTermResult.map((info, id) => {
                            if (info.subject === req.body.currentSubject) {
                                let totalscore = Number(info.resultNameXResultScore[req.body.valuePointId].valuePoint)
                                info.totalScore = Number(info.totalScore) - totalscore

                                let newScore = info.resultNameXResultScore.filter((point, id) => id !== req.body.valuePointId)
                                info.resultNameXResultScore = newScore
                            }

                        })
                    } else if (req.body.term === 2) {
                        result.jss3.secondTermResult.map((info, id) => {
                            if (info.subject === req.body.currentSubject) {
                                let totalscore = Number(info.resultNameXResultScore[req.body.valuePointId].valuePoint)
                                info.totalScore = Number(info.totalScore) - totalscore

                                let newScore = info.resultNameXResultScore.filter((point, id) => id !== req.body.valuePointId)
                                info.resultNameXResultScore = newScore
                            }
                        })
                    } else if (req.body.term === 3) {
                        result.jss3.thirdTermResult.map((info, id) => {
                            if (info.subject === req.body.currentSubject) {
                                let totalscore = Number(info.resultNameXResultScore[req.body.valuePointId].valuePoint)
                                info.totalScore = Number(info.totalScore) - totalscore

                                let newScore = info.resultNameXResultScore.filter((point, id) => id !== req.body.valuePointId)
                                info.resultNameXResultScore = newScore
                            }
                        })
                    }
                } else if (req.body.currentClass === "Sss1") {
                    if (req.body.term === 1) {
                        result.sss1.firstTermResult.map((info, id) => {
                            if (info.subject === req.body.currentSubject) {
                                let totalscore = Number(info.resultNameXResultScore[req.body.valuePointId].valuePoint)
                                info.totalScore = Number(info.totalScore) - totalscore

                                let newScore = info.resultNameXResultScore.filter((point, id) => id !== req.body.valuePointId)
                                info.resultNameXResultScore = newScore
                            }
                        })
                    } else if (req.body.term === 2) {
                        result.sss1.secondTermResult.map((info, id) => {
                            if (info.subject === req.body.currentSubject) {
                                let totalscore = Number(info.resultNameXResultScore[req.body.valuePointId].valuePoint)
                                info.totalScore = Number(info.totalScore) - totalscore

                                let newScore = info.resultNameXResultScore.filter((point, id) => id !== req.body.valuePointId)
                                info.resultNameXResultScore = newScore

                            }
                        })
                    } else if (req.body.term === 3) {
                        result.sss1.thirdTermResult.map((info, id) => {
                            if (info.subject === req.body.currentSubject) {
                                let totalscore = Number(info.resultNameXResultScore[req.body.valuePointId].valuePoint)
                                info.totalScore = Number(info.totalScore) - totalscore

                                let newScore = info.resultNameXResultScore.filter((point, id) => id !== req.body.valuePointId)
                                info.resultNameXResultScore = newScore
                            }
                        })
                    }
                } else if (req.body.currentClass === "Sss2") {
                    if (req.body.term === 1) {
                        result.sss2.firstTermResult.map((info, id) => {
                            if (info.subject === req.body.currentSubject) {
                                let totalscore = Number(info.resultNameXResultScore[req.body.valuePointId].valuePoint)
                                info.totalScore = Number(info.totalScore) - totalscore

                                let newScore = info.resultNameXResultScore.filter((point, id) => id !== req.body.valuePointId)
                                info.resultNameXResultScore = newScore
                            }
                        })
                    } else if (req.body.term === 2) {
                        result.sss2.secondTermResult.map((info, id) => {
                            if (info.subject === req.body.currentSubject) {
                                let totalscore = Number(info.resultNameXResultScore[req.body.valuePointId].valuePoint)
                                info.totalScore = Number(info.totalScore) - totalscore

                                let newScore = info.resultNameXResultScore.filter((point, id) => id !== req.body.valuePointId)
                                info.resultNameXResultScore = newScore
                            }
                        })
                    } else if (req.body.term === 3) {
                        result.sss2.thirdTermResult.map((info, id) => {
                            if (info.subject === req.body.currentSubject) {
                                let totalscore = Number(info.resultNameXResultScore[req.body.valuePointId].valuePoint)
                                info.totalScore = Number(info.totalScore) - totalscore

                                let newScore = info.resultNameXResultScore.filter((point, id) => id !== req.body.valuePointId)
                                info.resultNameXResultScore = newScore
                            }
                        })
                    }
                } else if (req.body.currentClass === "Sss3") {
                    if (req.body.term === 1) {
                        result.sss3.firstTermResult.map((info, id) => {
                            if (info.subject === req.body.currentSubject) {
                                let totalscore = Number(info.resultNameXResultScore[req.body.valuePointId].valuePoint)
                                info.totalScore = Number(info.totalScore) - totalscore

                                let newScore = info.resultNameXResultScore.filter((point, id) => id !== req.body.valuePointId)
                                info.resultNameXResultScore = newScore
                            }
                        })
                    } else if (req.body.term === 2) {
                        result.sss3.secondTermResult.map((info, id) => {
                            if (info.subject === req.body.currentSubject) {
                                let totalscore = Number(info.resultNameXResultScore[req.body.valuePointId].valuePoint)
                                info.totalScore = Number(info.totalScore) - totalscore

                                let newScore = info.resultNameXResultScore.filter((point, id) => id !== req.body.valuePointId)
                                info.resultNameXResultScore = newScore
                            }
                        })
                    } else if (req.body.term === 3) {
                        result.sss3.thirdTermResult.map((info, id) => {
                            if (info.subject === req.body.currentSubject) {
                                let totalscore = Number(info.resultNameXResultScore[req.body.valuePointId].valuePoint)
                                info.totalScore = Number(info.totalScore) - totalscore

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
                let check = []
                let status = false
                if (req.body.studentClass === "Jss1") {
                    if (req.body.term === 1) {
                        check = result.jss1.firstTermResult.filter((info, id) => info.subject === req.body.newSubject)
                        if (check.length > 0) {
                            res.send({ message: "Subject name already exist", status: false })
                            status = false
                        } else {
                            result.jss1.firstTermResult.map((subject, id) => {
                                if (subject.subject === req.body.subject) {
                                    subject.subject = req.body.newSubject
                                }
                            })
                            status = true
                        }
                    } else if (req.body.term === 2) {
                        check = result.jss1.secondTermResult.filter((info, id) => info.subject === req.body.newSubject)
                        if (check.length > 0) {
                            res.send({ message: "Subject name already exist", status: false })
                            status = false
                        } else {
                            status = true
                            result.jss1.secondTermResult.map((subject, id) => {
                                if (subject.subject === req.body.subject) {
                                    subject.subject = req.body.newSubject
                                }
                            })
                        }
                    } else if (req.body.term === 3) {
                        check = result.jss1.thirdTermResult.filter((info, id) => info.subject === req.body.newSubject)
                        if (check.length > 0) {
                            res.send({ message: "Subject name already exist", status: false })
                        } else {
                            result.jss1.thirdTermResult.map((subject, id) => {
                                if (subject.subject === req.body.subject) {
                                    subject.subject = req.body.newSubject
                                }
                            })
                        }
                    }
                } else if (req.body.studentClass === "Jss2") {
                    if (req.body.term === 1) {
                        check = result.jss2.firstTermResult.filter((info, id) => info.subject === req.body.newSubject)
                        if (check.length > 0) {
                            res.send({ message: "Subject name already exist", status: false })
                            status = false
                        } else {
                            status = true
                            result.jss2.firstTermResult.map((subject, id) => {
                                if (subject.subject === req.body.subject) {
                                    subject.subject = req.body.newSubject
                                }
                            })
                        }
                    } else if (req.body.term === 2) {
                        check = result.jss2.secondTermResult.filter((info, id) => info.subject === req.body.newSubject)
                        if (check.length > 0) {
                            res.send({ message: "Subject name already exist", status: false })
                            status = false
                        } else {
                            status = true
                            result.jss2.secondTermResult.map((subject, id) => {
                                if (subject.subject === req.body.subject) {
                                    subject.subject = req.body.newSubject
                                }
                            })
                        }
                    } else if (req.body.term === 3) {
                        check = result.jss2.thirdTermResult.filter((info, id) => info.subject === req.body.newSubject)
                        if (check.length > 0) {
                            res.send({ message: "Subject name already exist", status: false })
                            status = false
                        } else {
                            status = true
                            result.jss2.thirdTermResult.map((subject, id) => {
                                if (subject.subject === req.body.subject) {
                                    subject.subject = req.body.newSubject
                                }
                            })
                        }
                    }
                } else if (req.body.studentClass === "Jss3") {
                    if (req.body.term === 1) {
                        check = result.jss3.firstTermResult.filter((info, id) => info.subject === req.body.newSubject)
                        if (check.length > 0) {
                            res.send({ message: "Subject name already exist", status: false })
                            status = false
                        } else {
                            status = true
                            result.jss3.firstTermResult.map((subject, id) => {
                                if (subject.subject === req.body.subject) {
                                    subject.subject = req.body.newSubject
                                }
                            })
                        }
                    } else if (req.body.term === 2) {
                        check = result.jss3.secondTermResult.filter((info, id) => info.subject === req.body.newSubject)
                        if (check.length > 0) {
                            res.send({ message: "Subject name already exist", status: false })
                            status = false
                        } else {
                            status = true
                            result.jss3.secondTermResult.map((subject, id) => {
                                if (subject.subject === req.body.subject) {
                                    subject.subject = req.body.newSubject
                                }
                            })
                        }
                    } else if (req.body.term === 3) {
                        check = result.jss3.thirdTermResult.filter((info, id) => info.subject === req.body.newSubject)
                        if (check.length > 0) {
                            res.send({ message: "Subject name already exist", status: false })
                        } else {
                            result.jss3.thirdTermResult.map((subject, id) => {
                                if (subject.subject === req.body.subject) {
                                    subject.subject = req.body.newSubject
                                }
                            })
                        }
                    }
                } else if (req.body.studentClass === "Sss1") {
                    if (req.body.term === 1) {
                        check = result.sss1.firstTermResult.filter((info, id) => info.subject === req.body.newSubject)
                        if (check.length > 0) {
                            res.send({ message: "Subject name already exist", status: false })
                        } else {
                            result.sss1.firstTermResult.map((subject, id) => {
                                if (subject.subject === req.body.subject) {
                                    subject.subject = req.body.newSubject
                                }
                            })
                        }
                    } else if (req.body.term === 2) {
                        check = result.sss1.secondTermResult.filter((info, id) => info.subject === req.body.newSubject)
                        if (check.length > 0) {
                            res.send({ message: "Subject name already exist", status: false })
                            status = false
                        } else {
                            status = true
                            result.sss1.secondTermResult.map((subject, id) => {
                                if (subject.subject === req.body.subject) {
                                    subject.subject = req.body.newSubject
                                }
                            })
                        }
                    } else if (req.body.term === 3) {
                        check = result.sss1.thirdTermResult.filter((info, id) => info.subject === req.body.newSubject)
                        if (check.length > 0) {
                            res.send({ message: "Subject name already exist", status: false })
                            status = false
                        } else {
                            status = true
                            result.sss1.thirdTermResult.map((subject, id) => {
                                if (subject.subject === req.body.subject) {
                                    subject.subject = req.body.newSubject
                                }
                            })
                        }
                    }
                } else if (req.body.studentClass === "Sss2") {
                    if (req.body.term === 1) {
                        check = result.sss2.firstTermResult.filter((info, id) => info.subject === req.body.newSubject)
                        if (check.length > 0) {
                            res.send({ message: "Subject name already exist", status: false })
                            status = false
                        } else {
                            status = true
                            result.sss2.firstTermResult.map((subject, id) => {
                                if (subject.subject === req.body.subject) {
                                    subject.subject = req.body.newSubject
                                }
                            })
                        }
                    } else if (req.body.term === 2) {
                        check = result.sss2.secondTermResult.filter((info, id) => info.subject === req.body.newSubject)
                        if (check.length > 0) {
                            res.send({ message: "Subject name already exist", status: false })
                            status = false
                        } else {
                            status = true
                            result.sss2.secondTermResult.map((subject, id) => {
                                if (subject.subject === req.body.subject) {
                                    subject.subject = req.body.newSubject
                                }
                            })
                        }
                    } else if (req.body.term === 3) {
                        check = result.sss2.thirdTermResult.filter((info, id) => info.subject === req.body.newSubject)
                        if (check.length > 0) {
                            res.send({ message: "Subject name already exist", status: false })
                            status = false
                        } else {
                            status = true
                            result.ss21.thirdTermResult.map((subject, id) => {
                                if (subject.subject === req.body.subject) {
                                    subject.subject = req.body.newSubject
                                }
                            })
                        }
                    }
                } else if (req.body.studentClass === "Sss3") {
                    if (req.body.term === 1) {
                        check = result.sss3.firstTermResult.filter((info, id) => info.subject === req.body.newSubject)
                        if (check.length > 0) {
                            res.send({ message: "Subject name already exist", status: false })
                            status = false
                        } else {
                            status = true
                            result.sss3.firstTermResult.map((subject, id) => {
                                if (subject.subject === req.body.subject) {
                                    subject.subject = req.body.newSubject
                                }
                            })
                        }
                    } else if (req.body.term === 2) {
                        check = result.sss3.secondTermResult.filter((info, id) => info.subject === req.body.newSubject)
                        if (check.length > 0) {
                            res.send({ message: "Subject name already exist", status: false })
                            status = false
                        } else {
                            status = true
                            result.sss3.secondTermResult.map((subject, id) => {
                                if (subject.subject === req.body.subject) {
                                    subject.subject = req.body.newSubject
                                }
                            })
                        }
                    } else if (req.body.term === 3) {
                        check = result.sss3.thirdTermResult.filter((info, id) => info.subject === req.body.newSubject)
                        if (check.length > 0) {
                            res.send({ message: "Subject name already exist", status: false })
                            status = false
                        } else {
                            status = true
                            result.sss3.thirdTermResult.map((subject, id) => {
                                if (subject.subject === req.body.subject) {
                                    subject.subject = req.body.newSubject
                                }
                            })
                        }
                    }
                }
                if (status) {
                    studentModel.findByIdAndUpdate({ _id: req.body.studentId }, result, (err) => {
                        if (err) {
                            res.send({ message: "an error occured updating subject", status: false })
                        } else {
                            res.send({ message: "updated succesfully", status: true })
                        }
                    })
                }
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
                let check = []
                let status = false
                if (req.body.studentClass === "Jss1") {
                    if (req.body.term === 1) {
                        result.jss1.firstTermResult.map((subject, id) => {
                            if (subject.subject === req.body.subject) {
                                check = subject.resultNameXResultScore.filter((info, id) => info.valueName.toUpperCase() === req.body.newSubject.toUpperCase())
                            }

                        })
                        if (check.length > 0) {
                            res.send({ message: "value name already exist", status: false })
                            status = false
                        } else {
                            status = true
                            result.jss1.firstTermResult.map((subject, id) => {
                                if (subject.subject === req.body.subject) {
                                    subject.resultNameXResultScore[req.body.id].valueName = req.body.newSubject
                                }

                            })
                        }

                    } else if (req.body.term === 2) {
                        result.jss1.secondTermResult.map((subject, id) => {
                            if (subject.subject === req.body.subject) {
                                check = subject.resultNameXResultScore.filter((info, id) => info.valueName.toUpperCase() === req.body.newSubject.toUpperCase())
                            }

                        })
                        if (check.length > 0) {
                            status = false
                            res.send({ message: "value name already exist", status: false })
                        } else {
                            status = true
                            result.jss1.secondTermResult.map((subject, id) => {
                                if (subject.subject === req.body.subject) {
                                    subject.resultNameXResultScore[req.body.id].valueName = req.body.newSubject
                                }

                            })
                        }

                    } else if (req.body.term === 3) {
                        result.jss1.thirdTermResult.map((subject, id) => {
                            if (subject.subject === req.body.subject) {
                                check = subject.resultNameXResultScore.filter((info, id) => info.valueName.toUpperCase() === req.body.newSubject.toUpperCase())
                            }

                        })
                        if (check.length > 0) {
                            res.send({ message: "value name already exist", status: false })
                            status = false
                        } else {
                            status = true
                            result.jss1.thirdTermResult.map((subject, id) => {
                                if (subject.subject === req.body.subject) {
                                    subject.resultNameXResultScore[req.body.id].valueName = req.body.newSubject
                                }

                            })
                        }


                    }
                } else if (req.body.studentClass === "Jss2") {
                    if (req.body.term === 1) {
                        result.jss2.firstTermResult.map((subject, id) => {
                            if (subject.subject === req.body.subject) {
                                check = subject.resultNameXResultScore.filter((info, ud) => info.valueName.toUpperCase() === req.body.newSubject.toUpperCase())
                            }

                        })
                        if (check.length > 0) {
                            res.send({ message: "value name already exist", status: false })
                            status = false
                        } else {
                            status = true
                            result.jss2.firstTermResult.map((subject, id) => {
                                if (subject.subject === req.body.subject) {
                                    subject.resultNameXResultScore[req.body.id].valueName = req.body.newSubject
                                }

                            })
                        }
                    } else if (req.body.term === 2) {
                        result.jss2.secondTermResult.map((subject, id) => {
                            if (subject.subject === req.body.subject) {
                                check = subject.resultNameXResultScore.filter((info, ud) => info.valueName.toUpperCase() === req.body.newSubject.toUpperCase())
                            }

                        })
                        if (check.length > 0) {
                            res.send({ message: "value name already exist", status: false })
                            status = false
                        } else {
                            status = true
                            result.jss2.secondTermResult.map((subject, id) => {
                                if (subject.subject === req.body.subject) {
                                    subject.resultNameXResultScore[req.body.id].valueName = req.body.newSubject
                                }

                            })
                        }

                    } else if (req.body.term === 3) {
                        result.jss2.thirdTermResult.map((subject, id) => {
                            if (subject.subject === req.body.subject) {
                                check = subject.resultNameXResultScore.filter((info, ud) => info.valueName.toUpperCase() === req.body.newSubject.toUpperCase())
                            }

                        })
                        if (check.length > 0) {
                            res.send({ message: "value name already exist", status: false })
                            status = false
                        } else {
                            status = true
                            result.jss2.thirdTermResult.map((subject, id) => {
                                if (subject.subject === req.body.subject) {
                                    subject.resultNameXResultScore[req.body.id].valueName = req.body.newSubject
                                }

                            })
                        }


                    }
                } else if (req.body.studentClass === "Jss3") {
                    if (req.body.term === 1) {
                        result.jss3.firstTermResult.map((subject, id) => {
                            if (subject.subject === req.body.subject) {
                                check = subject.resultNameXResultScore.filter((info, ud) => info.valueName.toUpperCase() === req.body.newSubject.toUpperCase())
                            }

                        })
                        if (check.length > 0) {
                            res.send({ message: "value name already exist", status: false })
                            status = false
                        } else {
                            result.jss3.firstTermResult.map((subject, id) => {
                                if (subject.subject === req.body.subject) {
                                    subject.resultNameXResultScore[req.body.id].valueName = req.body.newSubject
                                }

                            })
                        }
                    } else if (req.body.term === 2) {
                        result.jss3.secondTermResult.map((subject, id) => {
                            if (subject.subject === req.body.subject) {
                                check = subject.resultNameXResultScore.filter((info, ud) => info.valueName.toUpperCase() === req.body.newSubject.toUpperCase())
                            }

                        })
                        if (check.length > 0) {
                            res.send({ message: "value name already exist", status: false })
                            status = false
                        } else {
                            status = true
                            result.jss3.secondTermResult.map((subject, id) => {
                                if (subject.subject === req.body.subject) {
                                    subject.resultNameXResultScore[req.body.id].valueName = req.body.newSubject
                                }

                            })
                        }

                    } else if (req.body.term === 3) {
                        result.jss3.thirdTermResult.map((subject, id) => {
                            if (subject.subject === req.body.subject) {
                                check = subject.resultNameXResultScore.filter((info, ud) => info.valueName.toUpperCase() === req.body.newSubject.toUpperCase())
                            }

                        })
                        if (check.length > 0) {
                            res.send({ message: "value name already exist", status: false })
                            status = false
                        } else {
                            status = true
                            result.jss3.thirdTermResult.map((subject, id) => {
                                if (subject.subject === req.body.subject) {
                                    subject.resultNameXResultScore[req.body.id].valueName = req.body.newSubject
                                }

                            })
                        }
                    }
                } else if (req.body.studentClass === "Sss1") {
                    if (req.body.term === 1) {
                        result.sss1.firstTermResult.map((subject, id) => {
                            if (subject.subject === req.body.subject) {
                                check = subject.resultNameXResultScore.filter((info, ud) => info.valueName.toUpperCase() === req.body.newSubject.toUpperCase())
                            }

                        })
                        if (check.length > 0) {
                            res.send({ message: "value name already exist", status: false })
                            status = false
                        } else {
                            status = true
                            result.sss1.firstTermResult.map((subject, id) => {
                                if (subject.subject === req.body.subject) {
                                    subject.resultNameXResultScore[req.body.id].valueName = req.body.newSubject
                                }

                            })
                        }
                    } else if (req.body.term === 2) {
                        result.sss1.secondTermResult.map((subject, id) => {
                            if (subject.subject === req.body.subject) {
                                check = subject.resultNameXResultScore.filter((info, ud) => info.valueName.toUpperCase() === req.body.newSubject.toUpperCase())
                            }

                        })
                        if (check.length > 0) {
                            res.send({ message: "value name already exist", status: false })
                            status = false
                        } else {
                            status = true
                            result.sss1.secondTermResult.map((subject, id) => {
                                if (subject.subject === req.body.subject) {
                                    subject.resultNameXResultScore[req.body.id].valueName = req.body.newSubject
                                }

                            })
                        }

                    } else if (req.body.term === 3) {
                        result.sss1.thirdTermResult.map((subject, id) => {
                            if (subject.subject === req.body.subject) {
                                check = subject.resultNameXResultScore.filter((info, ud) => info.valueName.toUpperCase() === req.body.newSubject.toUpperCase())
                            }

                        })
                        if (check.length > 0) {
                            res.send({ message: "value name already exist", status: false })
                            status = false
                        } else {
                            status = true
                            result.sss1.thirdTermResult.map((subject, id) => {
                                if (subject.subject === req.body.subject) {
                                    subject.resultNameXResultScore[req.body.id].valueName = req.body.newSubject
                                }

                            })
                        }

                    }
                } else if (req.body.studentClass === "Sss2") {
                    if (req.body.term === 1) {
                        result.sss2.firstTermResult.map((subject, id) => {
                            if (subject.subject === req.body.subject) {
                                check = subject.resultNameXResultScore.filter((info, ud) => info.valueName.toUpperCase() === req.body.newSubject.toUpperCase())
                            }

                        })
                        if (check.length > 0) {
                            res.send({ message: "value name already exist", status: false })
                            status = false
                        } else {
                            status = true
                            result.sss2.firstTermResult.map((subject, id) => {
                                if (subject.subject === req.body.subject) {
                                    subject.resultNameXResultScore[req.body.id].valueName = req.body.newSubject
                                }

                            })
                        }
                    } else if (req.body.term === 2) {
                        result.sss2.secondTermResult.map((subject, id) => {
                            if (subject.subject === req.body.subject) {
                                check = subject.resultNameXResultScore.filter((info, ud) => info.valueName.toUpperCase() === req.body.newSubject.toUpperCase())
                            }

                        })
                        if (check.length > 0) {
                            res.send({ message: "value name already exist", status: false })
                            status = false
                        } else {
                            status = true
                            result.sss2.secondTermResult.map((subject, id) => {
                                if (subject.subject === req.body.subject) {
                                    subject.resultNameXResultScore[req.body.id].valueName = req.body.newSubject
                                }

                            })
                        }

                    } else if (req.body.term === 3) {
                        result.sss2.thirdTermResult.map((subject, id) => {
                            if (subject.subject === req.body.subject) {
                                check = subject.resultNameXResultScore.filter((info, ud) => info.valueName.toUpperCase() === req.body.newSubject.toUpperCase())
                            }

                        })
                        if (check.length > 0) {
                            res.send({ message: "value name already exist", status: false })
                            status = false
                        } else {
                            status = true
                            result.sss2.thirdTermResult.map((subject, id) => {
                                if (subject.subject === req.body.subject) {
                                    subject.resultNameXResultScore[req.body.id].valueName = req.body.newSubject
                                }

                            })
                        }

                    }
                } else if (req.body.studentClass === "Sss3") {
                    if (req.body.term === 1) {
                        result.sss3.firstTermResult.map((subject, id) => {
                            if (subject.subject === req.body.subject) {
                                check = subject.resultNameXResultScore.filter((info, ud) => info.valueName.toUpperCase() === req.body.newSubject.toUpperCase())
                            }

                        })
                        if (check.length > 0) {
                            res.send({ message: "value name already exist", status: false })
                            status = false
                        } else {
                            status = true
                            result.sss3.firstTermResult.map((subject, id) => {
                                if (subject.subject === req.body.subject) {
                                    subject.resultNameXResultScore[req.body.id].valueName = req.body.newSubject
                                }

                            })
                        }
                    } else if (req.body.term === 2) {
                        result.sss3.secondTermResult.map((subject, id) => {
                            if (subject.subject === req.body.subject) {
                                check = subject.resultNameXResultScore.filter((info, ud) => info.valueName.toUpperCase() === req.body.newSubject.toUpperCase())
                            }

                        })
                        if (check.length > 0) {
                            res.send({ message: "value name already exist", status: false })
                            status = false
                        } else {
                            status = true
                            result.sss3.secondTermResult.map((subject, id) => {
                                if (subject.subject === req.body.subject) {
                                    subject.resultNameXResultScore[req.body.id].valueName = req.body.newSubject
                                }

                            })
                        }

                    } else if (req.body.term === 3) {
                        result.sss3.thirdTermResult.map((subject, id) => {
                            if (subject.subject === req.body.subject) {
                                check = subject.resultNameXResultScore.filter((info, ud) => info.valueName.toUpperCase() === req.body.newSubject.toUpperCase())
                            }

                        })
                        if (check.length > 0) {
                            res.send({ message: "value name already exist", status: false })
                            status = false
                        } else {
                            status = true
                            result.sss3.thirdTermResult.map((subject, id) => {
                                if (subject.subject === req.body.subject) {
                                    subject.resultNameXResultScore[req.body.id].valueName = req.body.newSubject
                                }

                            })
                        }

                    }
                }
                if (status) {
                    studentModel.findByIdAndUpdate({ _id: req.body.studentId }, result, (err) => {
                        if (err) {
                            res.send({ message: "an error occured updating subject", status: false })
                        } else {
                            res.send({ message: "updated succesfully", status: true })
                        }
                    })
                }
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
                                const fomerscoreMinus = subject.resultNameXResultScore[req.body.id].valuePoint
                                subject.totalScore = Number(subject.totalScore) - Number(fomerscoreMinus)
                                subject.totalScore = Number(subject.totalScore) + Number(req.body.newValuePoint)

                                subject.resultNameXResultScore[req.body.id].valuePoint = req.body.newValuePoint

                                if (subject.totalScore >= req.body.firstGrade.A1[0] && subject.totalScore <= req.body.firstGrade.A1[1]) {
                                    subject.grade = "A1"
                                    subject.gradeStatus = "Excellent"
                                } else if (subject.totalScore >= req.body.firstGrade.B2[0] && subject.totalScore <= req.body.firstGrade.B2[1]) {
                                    subject.grade = "B2"
                                    subject.gradeStatus = "Very Good"
                                } else if (subject.totalScore >= req.body.firstGrade.B3[0] && subject.totalScore <= req.body.firstGrade.B3[1]) {
                                    subject.grade = "B3"
                                    subject.gradeStatus = "Good"
                                } else if (subject.totalScore >= req.body.firstGrade.C4[0] && subject.totalScore <= req.body.firstGrade.C4[1]) {
                                    subject.grade = "C4"
                                    subject.gradeStatus = "Credit"
                                } else if (subject.totalScore >= req.body.firstGrade.C5[0] && subject.totalScore <= req.body.firstGrade.C5[1]) {
                                    subject.grade = "C5"
                                    subject.gradeStatus = "Credit"
                                } else if (subject.totalScore >= req.body.firstGrade.C6[0] && subject.totalScore <= req.body.firstGrade.C6[1]) {
                                    subject.grade = "C6"
                                    subject.gradeStatus = "Credit"
                                } else if (subject.totalScore >= req.body.firstGrade.D7[0] && subject.totalScore <= req.body.firstGrade.D7[1]) {
                                    subject.grade = "D7"
                                    subject.gradeStatus = "Pass"
                                } else if (subject.totalScore >= req.body.firstGrade.E8[0] && subject.totalScore <= req.body.firstGrade.E8[1]) {
                                    subject.grade = "E8"
                                    subject.gradeStatus = "Pass"
                                } else if (subject.totalScore >= req.body.firstGrade.F9[0] && subject.totalScore <= req.body.firstGrade.F9[1]) {
                                    subject.grade = "F9"
                                    subject.gradeStatus = "Fail"
                                }

                            }

                        })
                    } else if (req.body.term === 2) {
                        result.jss1.secondTermResult.map((subject, id) => {
                            if (subject.subject === req.body.subject) {
                                const fomerscoreMinus = subject.resultNameXResultScore[req.body.id].valuePoint
                                subject.totalScore = Number(subject.totalScore) - Number(fomerscoreMinus)
                                subject.totalScore = Number(subject.totalScore) + Number(req.body.newValuePoint)

                                subject.resultNameXResultScore[req.body.id].valuePoint = req.body.newValuePoint
                                if (subject.totalScore >= req.body.firstGrade.A1[0] && subject.totalScore <= req.body.firstGrade.A1[1]) {
                                    subject.grade = "A1"
                                    subject.gradeStatus = "Excellent"
                                } else if (subject.totalScore >= req.body.firstGrade.B2[0] && subject.totalScore <= req.body.firstGrade.B2[1]) {
                                    subject.grade = "B2"
                                    subject.gradeStatus = "Very Good"
                                } else if (subject.totalScore >= req.body.firstGrade.B3[0] && subject.totalScore <= req.body.firstGrade.B3[1]) {
                                    subject.grade = "B3"
                                    subject.gradeStatus = "Good"
                                } else if (subject.totalScore >= req.body.firstGrade.C4[0] && subject.totalScore <= req.body.firstGrade.C4[1]) {
                                    subject.grade = "C4"
                                    subject.gradeStatus = "Credit"
                                } else if (subject.totalScore >= req.body.firstGrade.C5[0] && subject.totalScore <= req.body.firstGrade.C5[1]) {
                                    subject.grade = "C5"
                                    subject.gradeStatus = "Credit"
                                } else if (subject.totalScore >= req.body.firstGrade.C6[0] && subject.totalScore <= req.body.firstGrade.C6[1]) {
                                    subject.grade = "C6"
                                    subject.gradeStatus = "Credit"
                                } else if (subject.totalScore >= req.body.firstGrade.D7[0] && subject.totalScore <= req.body.firstGrade.D7[1]) {
                                    subject.grade = "D7"
                                    subject.gradeStatus = "Pass"
                                } else if (subject.totalScore >= req.body.firstGrade.E8[0] && subject.totalScore <= req.body.firstGrade.E8[1]) {
                                    subject.grade = "E8"
                                    subject.gradeStatus = "Pass"
                                } else if (subject.totalScore >= req.body.firstGrade.F9[0] && subject.totalScore <= req.body.firstGrade.F9[1]) {
                                    subject.grade = "F9"
                                    subject.gradeStatus = "Fail"
                                }
                            }

                        })

                    } else if (req.body.term === 3) {
                        result.jss1.thirdTermResult.map((subject, id) => {
                            if (subject.subject === req.body.subject) {
                                const fomerscoreMinus = subject.resultNameXResultScore[req.body.id].valuePoint
                                subject.totalScore = Number(subject.totalScore) - Number(fomerscoreMinus)
                                subject.totalScore = Number(subject.totalScore) + Number(req.body.newValuePoint)

                                subject.resultNameXResultScore[req.body.id].valuePoint = req.body.newValuePoint
                                if (subject.totalScore >= req.body.firstGrade.A1[0] && subject.totalScore <= req.body.firstGrade.A1[1]) {
                                    subject.grade = "A1"
                                    subject.gradeStatus = "Excellent"
                                } else if (subject.totalScore >= req.body.firstGrade.B2[0] && subject.totalScore <= req.body.firstGrade.B2[1]) {
                                    subject.grade = "B2"
                                    subject.gradeStatus = "Very Good"
                                } else if (subject.totalScore >= req.body.firstGrade.B3[0] && subject.totalScore <= req.body.firstGrade.B3[1]) {
                                    subject.grade = "B3"
                                    subject.gradeStatus = "Good"
                                } else if (subject.totalScore >= req.body.firstGrade.C4[0] && subject.totalScore <= req.body.firstGrade.C4[1]) {
                                    subject.grade = "C4"
                                    subject.gradeStatus = "Credit"
                                } else if (subject.totalScore >= req.body.firstGrade.C5[0] && subject.totalScore <= req.body.firstGrade.C5[1]) {
                                    subject.grade = "C5"
                                    subject.gradeStatus = "Credit"
                                } else if (subject.totalScore >= req.body.firstGrade.C6[0] && subject.totalScore <= req.body.firstGrade.C6[1]) {
                                    subject.grade = "C6"
                                    subject.gradeStatus = "Credit"
                                } else if (subject.totalScore >= req.body.firstGrade.D7[0] && subject.totalScore <= req.body.firstGrade.D7[1]) {
                                    subject.grade = "D7"
                                    subject.gradeStatus = "Pass"
                                } else if (subject.totalScore >= req.body.firstGrade.E8[0] && subject.totalScore <= req.body.firstGrade.E8[1]) {
                                    subject.grade = "E8"
                                    subject.gradeStatus = "Pass"
                                } else if (subject.totalScore >= req.body.firstGrade.F9[0] && subject.totalScore <= req.body.firstGrade.F9[1]) {
                                    subject.grade = "F9"
                                    subject.gradeStatus = "Fail"
                                }

                            }

                        })

                    }
                } else if (req.body.studentClass === "Jss2") {
                    if (req.body.term === 1) {
                        result.jss2.firstTermResult.map((subject, id) => {
                            if (subject.subject === req.body.subject) {
                                const fomerscoreMinus = subject.resultNameXResultScore[req.body.id].valuePoint
                                subject.totalScore = Number(subject.totalScore) - Number(fomerscoreMinus)
                                subject.totalScore = Number(subject.totalScore) + Number(req.body.newValuePoint)

                                subject.resultNameXResultScore[req.body.id].valuePoint = req.body.newValuePoint
                                if (subject.totalScore >= req.body.firstGrade.A1[0] && subject.totalScore <= req.body.firstGrade.A1[1]) {
                                    subject.grade = "A1"
                                    subject.gradeStatus = "Excellent"
                                } else if (subject.totalScore >= req.body.firstGrade.B2[0] && subject.totalScore <= req.body.firstGrade.B2[1]) {
                                    subject.grade = "B2"
                                    subject.gradeStatus = "Very Good"
                                } else if (subject.totalScore >= req.body.firstGrade.B3[0] && subject.totalScore <= req.body.firstGrade.B3[1]) {
                                    subject.grade = "B3"
                                    subject.gradeStatus = "Good"
                                } else if (subject.totalScore >= req.body.firstGrade.C4[0] && subject.totalScore <= req.body.firstGrade.C4[1]) {
                                    subject.grade = "C4"
                                    subject.gradeStatus = "Credit"
                                } else if (subject.totalScore >= req.body.firstGrade.C5[0] && subject.totalScore <= req.body.firstGrade.C5[1]) {
                                    subject.grade = "C5"
                                    subject.gradeStatus = "Credit"
                                } else if (subject.totalScore >= req.body.firstGrade.C6[0] && subject.totalScore <= req.body.firstGrade.C6[1]) {
                                    subject.grade = "C6"
                                    subject.gradeStatus = "Credit"
                                } else if (subject.totalScore >= req.body.firstGrade.D7[0] && subject.totalScore <= req.body.firstGrade.D7[1]) {
                                    subject.grade = "D7"
                                    subject.gradeStatus = "Pass"
                                } else if (subject.totalScore >= req.body.firstGrade.E8[0] && subject.totalScore <= req.body.firstGrade.E8[1]) {
                                    subject.grade = "E8"
                                    subject.gradeStatus = "Pass"
                                } else if (subject.totalScore >= req.body.firstGrade.F9[0] && subject.totalScore <= req.body.firstGrade.F9[1]) {
                                    subject.grade = "F9"
                                    subject.gradeStatus = "Fail"
                                }

                            }

                        })
                    } else if (req.body.term === 2) {
                        result.jss2.secondTermResult.map((subject, id) => {
                            if (subject.subject === req.body.subject) {
                                const fomerscoreMinus = subject.resultNameXResultScore[req.body.id].valuePoint
                                subject.totalScore = Number(subject.totalScore) - Number(fomerscoreMinus)
                                subject.totalScore = Number(subject.totalScore) + Number(req.body.newValuePoint)

                                subject.resultNameXResultScore[req.body.id].valuePoint = req.body.newValuePoint

                                if (subject.totalScore >= req.body.firstGrade.A1[0] && subject.totalScore <= req.body.firstGrade.A1[1]) {
                                    subject.grade = "A1"
                                    subject.gradeStatus = "Excellent"
                                } else if (subject.totalScore >= req.body.firstGrade.B2[0] && subject.totalScore <= req.body.firstGrade.B2[1]) {
                                    subject.grade = "B2"
                                    subject.gradeStatus = "Very Good"
                                } else if (subject.totalScore >= req.body.firstGrade.B3[0] && subject.totalScore <= req.body.firstGrade.B3[1]) {
                                    subject.grade = "B3"
                                    subject.gradeStatus = "Good"
                                } else if (subject.totalScore >= req.body.firstGrade.C4[0] && subject.totalScore <= req.body.firstGrade.C4[1]) {
                                    subject.grade = "C4"
                                    subject.gradeStatus = "Credit"
                                } else if (subject.totalScore >= req.body.firstGrade.C5[0] && subject.totalScore <= req.body.firstGrade.C5[1]) {
                                    subject.grade = "C5"
                                    subject.gradeStatus = "Credit"
                                } else if (subject.totalScore >= req.body.firstGrade.C6[0] && subject.totalScore <= req.body.firstGrade.C6[1]) {
                                    subject.grade = "C6"
                                    subject.gradeStatus = "Credit"
                                } else if (subject.totalScore >= req.body.firstGrade.D7[0] && subject.totalScore <= req.body.firstGrade.D7[1]) {
                                    subject.grade = "D7"
                                    subject.gradeStatus = "Pass"
                                } else if (subject.totalScore >= req.body.firstGrade.E8[0] && subject.totalScore <= req.body.firstGrade.E8[1]) {
                                    subject.grade = "E8"
                                    subject.gradeStatus = "Pass"
                                } else if (subject.totalScore >= req.body.firstGrade.F9[0] && subject.totalScore <= req.body.firstGrade.F9[1]) {
                                    subject.grade = "F9"
                                    subject.gradeStatus = "Fail"
                                }
                            }

                        })

                    } else if (req.body.term === 3) {
                        result.jss2.thirdTermResult.map((subject, id) => {
                            if (subject.subject === req.body.subject) {
                                const fomerscoreMinus = subject.resultNameXResultScore[req.body.id].valuePoint
                                subject.totalScore = Number(subject.totalScore) - Number(fomerscoreMinus)
                                subject.totalScore = Number(subject.totalScore) + Number(req.body.newValuePoint)

                                subject.resultNameXResultScore[req.body.id].valuePoint = req.body.newValuePoint
                                if (subject.totalScore >= req.body.firstGrade.A1[0] && subject.totalScore <= req.body.firstGrade.A1[1]) {
                                    subject.grade = "A1"
                                    subject.gradeStatus = "Excellent"
                                } else if (subject.totalScore >= req.body.firstGrade.B2[0] && subject.totalScore <= req.body.firstGrade.B2[1]) {
                                    subject.grade = "B2"
                                    subject.gradeStatus = "Very Good"
                                } else if (subject.totalScore >= req.body.firstGrade.B3[0] && subject.totalScore <= req.body.firstGrade.B3[1]) {
                                    subject.grade = "B3"
                                    subject.gradeStatus = "Good"
                                } else if (subject.totalScore >= req.body.firstGrade.C4[0] && subject.totalScore <= req.body.firstGrade.C4[1]) {
                                    subject.grade = "C4"
                                    subject.gradeStatus = "Credit"
                                } else if (subject.totalScore >= req.body.firstGrade.C5[0] && subject.totalScore <= req.body.firstGrade.C5[1]) {
                                    subject.grade = "C5"
                                    subject.gradeStatus = "Credit"
                                } else if (subject.totalScore >= req.body.firstGrade.C6[0] && subject.totalScore <= req.body.firstGrade.C6[1]) {
                                    subject.grade = "C6"
                                    subject.gradeStatus = "Credit"
                                } else if (subject.totalScore >= req.body.firstGrade.D7[0] && subject.totalScore <= req.body.firstGrade.D7[1]) {
                                    subject.grade = "D7"
                                    subject.gradeStatus = "Pass"
                                } else if (subject.totalScore >= req.body.firstGrade.E8[0] && subject.totalScore <= req.body.firstGrade.E8[1]) {
                                    subject.grade = "E8"
                                    subject.gradeStatus = "Pass"
                                } else if (subject.totalScore >= req.body.firstGrade.F9[0] && subject.totalScore <= req.body.firstGrade.F9[1]) {
                                    subject.grade = "F9"
                                    subject.gradeStatus = "Fail"
                                }
                            }

                        })

                    }
                } else if (req.body.studentClass === "Jss3") {
                    if (req.body.term === 1) {
                        result.jss3.firstTermResult.map((subject, id) => {
                            if (subject.subject === req.body.subject) {
                                const fomerscoreMinus = subject.resultNameXResultScore[req.body.id].valuePoint
                                subject.totalScore = Number(subject.totalScore) - Number(fomerscoreMinus)
                                subject.totalScore = Number(subject.totalScore) + Number(req.body.newValuePoint)

                                subject.resultNameXResultScore[req.body.id].valuePoint = req.body.newValuePoint
                                if (subject.totalScore >= req.body.firstGrade.A1[0] && subject.totalScore <= req.body.firstGrade.A1[1]) {
                                    subject.grade = "A1"
                                    subject.gradeStatus = "Excellent"
                                } else if (subject.totalScore >= req.body.firstGrade.B2[0] && subject.totalScore <= req.body.firstGrade.B2[1]) {
                                    subject.grade = "B2"
                                    subject.gradeStatus = "Very Good"
                                } else if (subject.totalScore >= req.body.firstGrade.B3[0] && subject.totalScore <= req.body.firstGrade.B3[1]) {
                                    subject.grade = "B3"
                                    subject.gradeStatus = "Good"
                                } else if (subject.totalScore >= req.body.firstGrade.C4[0] && subject.totalScore <= req.body.firstGrade.C4[1]) {
                                    subject.grade = "C4"
                                    subject.gradeStatus = "Credit"
                                } else if (subject.totalScore >= req.body.firstGrade.C5[0] && subject.totalScore <= req.body.firstGrade.C5[1]) {
                                    subject.grade = "C5"
                                    subject.gradeStatus = "Credit"
                                } else if (subject.totalScore >= req.body.firstGrade.C6[0] && subject.totalScore <= req.body.firstGrade.C6[1]) {
                                    subject.grade = "C6"
                                    subject.gradeStatus = "Credit"
                                } else if (subject.totalScore >= req.body.firstGrade.D7[0] && subject.totalScore <= req.body.firstGrade.D7[1]) {
                                    subject.grade = "D7"
                                    subject.gradeStatus = "Pass"
                                } else if (subject.totalScore >= req.body.firstGrade.E8[0] && subject.totalScore <= req.body.firstGrade.E8[1]) {
                                    subject.grade = "E8"
                                    subject.gradeStatus = "Pass"
                                } else if (subject.totalScore >= req.body.firstGrade.F9[0] && subject.totalScore <= req.body.firstGrade.F9[1]) {
                                    subject.grade = "F9"
                                    subject.gradeStatus = "Fail"
                                }

                            }

                        })
                    } else if (req.body.term === 2) {
                        result.jss3.secondTermResult.map((subject, id) => {
                            if (subject.subject === req.body.subject) {
                                const fomerscoreMinus = subject.resultNameXResultScore[req.body.id].valuePoint
                                subject.totalScore = Number(subject.totalScore) - Number(fomerscoreMinus)
                                subject.totalScore = Number(subject.totalScore) + Number(req.body.newValuePoint)

                                subject.resultNameXResultScore[req.body.id].valuePoint = req.body.newValuePoint
                                if (subject.totalScore >= req.body.firstGrade.A1[0] && subject.totalScore <= req.body.firstGrade.A1[1]) {
                                    subject.grade = "A1"
                                    subject.gradeStatus = "Excellent"
                                } else if (subject.totalScore >= req.body.firstGrade.B2[0] && subject.totalScore <= req.body.firstGrade.B2[1]) {
                                    subject.grade = "B2"
                                    subject.gradeStatus = "Very Good"
                                } else if (subject.totalScore >= req.body.firstGrade.B3[0] && subject.totalScore <= req.body.firstGrade.B3[1]) {
                                    subject.grade = "B3"
                                    subject.gradeStatus = "Good"
                                } else if (subject.totalScore >= req.body.firstGrade.C4[0] && subject.totalScore <= req.body.firstGrade.C4[1]) {
                                    subject.grade = "C4"
                                    subject.gradeStatus = "Credit"
                                } else if (subject.totalScore >= req.body.firstGrade.C5[0] && subject.totalScore <= req.body.firstGrade.C5[1]) {
                                    subject.grade = "C5"
                                    subject.gradeStatus = "Credit"
                                } else if (subject.totalScore >= req.body.firstGrade.C6[0] && subject.totalScore <= req.body.firstGrade.C6[1]) {
                                    subject.grade = "C6"
                                    subject.gradeStatus = "Credit"
                                } else if (subject.totalScore >= req.body.firstGrade.D7[0] && subject.totalScore <= req.body.firstGrade.D7[1]) {
                                    subject.grade = "D7"
                                    subject.gradeStatus = "Pass"
                                } else if (subject.totalScore >= req.body.firstGrade.E8[0] && subject.totalScore <= req.body.firstGrade.E8[1]) {
                                    subject.grade = "E8"
                                    subject.gradeStatus = "Pass"
                                } else if (subject.totalScore >= req.body.firstGrade.F9[0] && subject.totalScore <= req.body.firstGrade.F9[1]) {
                                    subject.grade = "F9"
                                    subject.gradeStatus = "Fail"
                                }
                            }

                        })

                    } else if (req.body.term === 3) {
                        result.jss3.thirdTermResult.map((subject, id) => {
                            if (subject.subject === req.body.subject) {
                                const fomerscoreMinus = subject.resultNameXResultScore[req.body.id].valuePoint
                                subject.totalScore = Number(subject.totalScore) - Number(fomerscoreMinus)
                                subject.totalScore = Number(subject.totalScore) + Number(req.body.newValuePoint)

                                subject.resultNameXResultScore[req.body.id].valuePoint = req.body.newValuePoint
                                if (subject.totalScore >= req.body.firstGrade.A1[0] && subject.totalScore <= req.body.firstGrade.A1[1]) {
                                    subject.grade = "A1"
                                    subject.gradeStatus = "Excellent"
                                } else if (subject.totalScore >= req.body.firstGrade.B2[0] && subject.totalScore <= req.body.firstGrade.B2[1]) {
                                    subject.grade = "B2"
                                    subject.gradeStatus = "Very Good"
                                } else if (subject.totalScore >= req.body.firstGrade.B3[0] && subject.totalScore <= req.body.firstGrade.B3[1]) {
                                    subject.grade = "B3"
                                    subject.gradeStatus = "Good"
                                } else if (subject.totalScore >= req.body.firstGrade.C4[0] && subject.totalScore <= req.body.firstGrade.C4[1]) {
                                    subject.grade = "C4"
                                    subject.gradeStatus = "Credit"
                                } else if (subject.totalScore >= req.body.firstGrade.C5[0] && subject.totalScore <= req.body.firstGrade.C5[1]) {
                                    subject.grade = "C5"
                                    subject.gradeStatus = "Credit"
                                } else if (subject.totalScore >= req.body.firstGrade.C6[0] && subject.totalScore <= req.body.firstGrade.C6[1]) {
                                    subject.grade = "C6"
                                    subject.gradeStatus = "Credit"
                                } else if (subject.totalScore >= req.body.firstGrade.D7[0] && subject.totalScore <= req.body.firstGrade.D7[1]) {
                                    subject.grade = "D7"
                                    subject.gradeStatus = "Pass"
                                } else if (subject.totalScore >= req.body.firstGrade.E8[0] && subject.totalScore <= req.body.firstGrade.E8[1]) {
                                    subject.grade = "E8"
                                    subject.gradeStatus = "Pass"
                                } else if (subject.totalScore >= req.body.firstGrade.F9[0] && subject.totalScore <= req.body.firstGrade.F9[1]) {
                                    subject.grade = "F9"
                                    subject.gradeStatus = "Fail"
                                }
                            }

                        })

                    }
                } else if (req.body.studentClass === "Sss1") {
                    if (req.body.term === 1) {
                        result.sss1.firstTermResult.map((subject, id) => {
                            if (subject.subject === req.body.subject) {
                                const fomerscoreMinus = subject.resultNameXResultScore[req.body.id].valuePoint
                                subject.totalScore = Number(subject.totalScore) - Number(fomerscoreMinus)
                                subject.totalScore = Number(subject.totalScore) + Number(req.body.newValuePoint)

                                subject.resultNameXResultScore[req.body.id].valuePoint = req.body.newValuePoint
                                if (subject.totalScore >= req.body.firstGrade.A1[0] && subject.totalScore <= req.body.firstGrade.A1[1]) {
                                    subject.grade = "A1"
                                    subject.gradeStatus = "Excellent"
                                } else if (subject.totalScore >= req.body.firstGrade.B2[0] && subject.totalScore <= req.body.firstGrade.B2[1]) {
                                    subject.grade = "B2"
                                    subject.gradeStatus = "Very Good"
                                } else if (subject.totalScore >= req.body.firstGrade.B3[0] && subject.totalScore <= req.body.firstGrade.B3[1]) {
                                    subject.grade = "B3"
                                    subject.gradeStatus = "Good"
                                } else if (subject.totalScore >= req.body.firstGrade.C4[0] && subject.totalScore <= req.body.firstGrade.C4[1]) {
                                    subject.grade = "C4"
                                    subject.gradeStatus = "Credit"
                                } else if (subject.totalScore >= req.body.firstGrade.C5[0] && subject.totalScore <= req.body.firstGrade.C5[1]) {
                                    subject.grade = "C5"
                                    subject.gradeStatus = "Credit"
                                } else if (subject.totalScore >= req.body.firstGrade.C6[0] && subject.totalScore <= req.body.firstGrade.C6[1]) {
                                    subject.grade = "C6"
                                    subject.gradeStatus = "Credit"
                                } else if (subject.totalScore >= req.body.firstGrade.D7[0] && subject.totalScore <= req.body.firstGrade.D7[1]) {
                                    subject.grade = "D7"
                                    subject.gradeStatus = "Pass"
                                } else if (subject.totalScore >= req.body.firstGrade.E8[0] && subject.totalScore <= req.body.firstGrade.E8[1]) {
                                    subject.grade = "E8"
                                    subject.gradeStatus = "Pass"
                                } else if (subject.totalScore >= req.body.firstGrade.F9[0] && subject.totalScore <= req.body.firstGrade.F9[1]) {
                                    subject.grade = "F9"
                                    subject.gradeStatus = "Fail"
                                }

                            }

                        })
                    } else if (req.body.term === 2) {
                        result.sss1.secondTermResult.map((subject, id) => {
                            if (subject.subject === req.body.subject) {
                                const fomerscoreMinus = subject.resultNameXResultScore[req.body.id].valuePoint
                                subject.totalScore = Number(subject.totalScore) - Number(fomerscoreMinus)
                                subject.totalScore = Number(subject.totalScore) + Number(req.body.newValuePoint)

                                subject.resultNameXResultScore[req.body.id].valuePoint = req.body.newValuePoint
                                if (subject.totalScore >= req.body.firstGrade.A1[0] && subject.totalScore <= req.body.firstGrade.A1[1]) {
                                    subject.grade = "A1"
                                    subject.gradeStatus = "Excellent"
                                } else if (subject.totalScore >= req.body.firstGrade.B2[0] && subject.totalScore <= req.body.firstGrade.B2[1]) {
                                    subject.grade = "B2"
                                    subject.gradeStatus = "Very Good"
                                } else if (subject.totalScore >= req.body.firstGrade.B3[0] && subject.totalScore <= req.body.firstGrade.B3[1]) {
                                    subject.grade = "B3"
                                    subject.gradeStatus = "Good"
                                } else if (subject.totalScore >= req.body.firstGrade.C4[0] && subject.totalScore <= req.body.firstGrade.C4[1]) {
                                    subject.grade = "C4"
                                    subject.gradeStatus = "Credit"
                                } else if (subject.totalScore >= req.body.firstGrade.C5[0] && subject.totalScore <= req.body.firstGrade.C5[1]) {
                                    subject.grade = "C5"
                                    subject.gradeStatus = "Credit"
                                } else if (subject.totalScore >= req.body.firstGrade.C6[0] && subject.totalScore <= req.body.firstGrade.C6[1]) {
                                    subject.grade = "C6"
                                    subject.gradeStatus = "Credit"
                                } else if (subject.totalScore >= req.body.firstGrade.D7[0] && subject.totalScore <= req.body.firstGrade.D7[1]) {
                                    subject.grade = "D7"
                                    subject.gradeStatus = "Pass"
                                } else if (subject.totalScore >= req.body.firstGrade.E8[0] && subject.totalScore <= req.body.firstGrade.E8[1]) {
                                    subject.grade = "E8"
                                    subject.gradeStatus = "Pass"
                                } else if (subject.totalScore >= req.body.firstGrade.F9[0] && subject.totalScore <= req.body.firstGrade.F9[1]) {
                                    subject.grade = "F9"
                                    subject.gradeStatus = "Fail"
                                }
                            }

                        })

                    } else if (req.body.term === 3) {
                        result.sss1.thirdTermResult.map((subject, id) => {
                            if (subject.subject === req.body.subject) {
                                const fomerscoreMinus = subject.resultNameXResultScore[req.body.id].valuePoint
                                subject.totalScore = Number(subject.totalScore) - Number(fomerscoreMinus)
                                subject.totalScore = Number(subject.totalScore) + Number(req.body.newValuePoint)

                                subject.resultNameXResultScore[req.body.id].valuePoint = req.body.newValuePoint

                                if (subject.totalScore >= req.body.firstGrade.A1[0] && subject.totalScore <= req.body.firstGrade.A1[1]) {
                                    subject.grade = "A1"
                                    subject.gradeStatus = "Excellent"
                                } else if (subject.totalScore >= req.body.firstGrade.B2[0] && subject.totalScore <= req.body.firstGrade.B2[1]) {
                                    subject.grade = "B2"
                                    subject.gradeStatus = "Very Good"
                                } else if (subject.totalScore >= req.body.firstGrade.B3[0] && subject.totalScore <= req.body.firstGrade.B3[1]) {
                                    subject.grade = "B3"
                                    subject.gradeStatus = "Good"
                                } else if (subject.totalScore >= req.body.firstGrade.C4[0] && subject.totalScore <= req.body.firstGrade.C4[1]) {
                                    subject.grade = "C4"
                                    subject.gradeStatus = "Credit"
                                } else if (subject.totalScore >= req.body.firstGrade.C5[0] && subject.totalScore <= req.body.firstGrade.C5[1]) {
                                    subject.grade = "C5"
                                    subject.gradeStatus = "Credit"
                                } else if (subject.totalScore >= req.body.firstGrade.C6[0] && subject.totalScore <= req.body.firstGrade.C6[1]) {
                                    subject.grade = "C6"
                                    subject.gradeStatus = "Credit"
                                } else if (subject.totalScore >= req.body.firstGrade.D7[0] && subject.totalScore <= req.body.firstGrade.D7[1]) {
                                    subject.grade = "D7"
                                    subject.gradeStatus = "Pass"
                                } else if (subject.totalScore >= req.body.firstGrade.E8[0] && subject.totalScore <= req.body.firstGrade.E8[1]) {
                                    subject.grade = "E8"
                                    subject.gradeStatus = "Pass"
                                } else if (subject.totalScore >= req.body.firstGrade.F9[0] && subject.totalScore <= req.body.firstGrade.F9[1]) {
                                    subject.grade = "F9"
                                    subject.gradeStatus = "Fail"
                                }
                            }

                        })

                    }
                } else if (req.body.studentClass === "Sss2") {
                    if (req.body.term === 1) {
                        result.sss2.firstTermResult.map((subject, id) => {
                            if (subject.subject === req.body.subject) {
                                const fomerscoreMinus = subject.resultNameXResultScore[req.body.id].valuePoint
                                subject.totalScore = Number(subject.totalScore) - Number(fomerscoreMinus)
                                subject.totalScore = Number(subject.totalScore) + Number(req.body.newValuePoint)

                                subject.resultNameXResultScore[req.body.id].valuePoint = req.body.newValuePoint

                                if (subject.totalScore >= req.body.firstGrade.A1[0] && subject.totalScore <= req.body.firstGrade.A1[1]) {
                                    subject.grade = "A1"
                                    subject.gradeStatus = "Excellent"
                                } else if (subject.totalScore >= req.body.firstGrade.B2[0] && subject.totalScore <= req.body.firstGrade.B2[1]) {
                                    subject.grade = "B2"
                                    subject.gradeStatus = "Very Good"
                                } else if (subject.totalScore >= req.body.firstGrade.B3[0] && subject.totalScore <= req.body.firstGrade.B3[1]) {
                                    subject.grade = "B3"
                                    subject.gradeStatus = "Good"
                                } else if (subject.totalScore >= req.body.firstGrade.C4[0] && subject.totalScore <= req.body.firstGrade.C4[1]) {
                                    subject.grade = "C4"
                                    subject.gradeStatus = "Credit"
                                } else if (subject.totalScore >= req.body.firstGrade.C5[0] && subject.totalScore <= req.body.firstGrade.C5[1]) {
                                    subject.grade = "C5"
                                    subject.gradeStatus = "Credit"
                                } else if (subject.totalScore >= req.body.firstGrade.C6[0] && subject.totalScore <= req.body.firstGrade.C6[1]) {
                                    subject.grade = "C6"
                                    subject.gradeStatus = "Credit"
                                } else if (subject.totalScore >= req.body.firstGrade.D7[0] && subject.totalScore <= req.body.firstGrade.D7[1]) {
                                    subject.grade = "D7"
                                    subject.gradeStatus = "Pass"
                                } else if (subject.totalScore >= req.body.firstGrade.E8[0] && subject.totalScore <= req.body.firstGrade.E8[1]) {
                                    subject.grade = "E8"
                                    subject.gradeStatus = "Pass"
                                } else if (subject.totalScore >= req.body.firstGrade.F9[0] && subject.totalScore <= req.body.firstGrade.F9[1]) {
                                    subject.grade = "F9"
                                    subject.gradeStatus = "Fail"
                                }

                            }

                        })
                    } else if (req.body.term === 2) {
                        result.sss2.secondTermResult.map((subject, id) => {
                            if (subject.subject === req.body.subject) {
                                const fomerscoreMinus = subject.resultNameXResultScore[req.body.id].valuePoint
                                subject.totalScore = Number(subject.totalScore) - Number(fomerscoreMinus)
                                subject.totalScore = Number(subject.totalScore) + Number(req.body.newValuePoint)

                                subject.resultNameXResultScore[req.body.id].valuePoint = req.body.newValuePoint

                                if (subject.totalScore >= req.body.firstGrade.A1[0] && subject.totalScore <= req.body.firstGrade.A1[1]) {
                                    subject.grade = "A1"
                                    subject.gradeStatus = "Excellent"
                                } else if (subject.totalScore >= req.body.firstGrade.B2[0] && subject.totalScore <= req.body.firstGrade.B2[1]) {
                                    subject.grade = "B2"
                                    subject.gradeStatus = "Very Good"
                                } else if (subject.totalScore >= req.body.firstGrade.B3[0] && subject.totalScore <= req.body.firstGrade.B3[1]) {
                                    subject.grade = "B3"
                                    subject.gradeStatus = "Good"
                                } else if (subject.totalScore >= req.body.firstGrade.C4[0] && subject.totalScore <= req.body.firstGrade.C4[1]) {
                                    subject.grade = "C4"
                                    subject.gradeStatus = "Credit"
                                } else if (subject.totalScore >= req.body.firstGrade.C5[0] && subject.totalScore <= req.body.firstGrade.C5[1]) {
                                    subject.grade = "C5"
                                    subject.gradeStatus = "Credit"
                                } else if (subject.totalScore >= req.body.firstGrade.C6[0] && subject.totalScore <= req.body.firstGrade.C6[1]) {
                                    subject.grade = "C6"
                                    subject.gradeStatus = "Credit"
                                } else if (subject.totalScore >= req.body.firstGrade.D7[0] && subject.totalScore <= req.body.firstGrade.D7[1]) {
                                    subject.grade = "D7"
                                    subject.gradeStatus = "Pass"
                                } else if (subject.totalScore >= req.body.firstGrade.E8[0] && subject.totalScore <= req.body.firstGrade.E8[1]) {
                                    subject.grade = "E8"
                                    subject.gradeStatus = "Pass"
                                } else if (subject.totalScore >= req.body.firstGrade.F9[0] && subject.totalScore <= req.body.firstGrade.F9[1]) {
                                    subject.grade = "F9"
                                    subject.gradeStatus = "Fail"
                                }
                            }

                        })

                    } else if (req.body.term === 3) {
                        result.sss2.thirdTermResult.map((subject, id) => {
                            if (subject.subject === req.body.subject) {
                                const fomerscoreMinus = subject.resultNameXResultScore[req.body.id].valuePoint
                                subject.totalScore = Number(subject.totalScore) - Number(fomerscoreMinus)
                                subject.totalScore = Number(subject.totalScore) + Number(req.body.newValuePoint)

                                subject.resultNameXResultScore[req.body.id].valuePoint = req.body.newValuePoint

                                if (subject.totalScore >= req.body.firstGrade.A1[0] && subject.totalScore <= req.body.firstGrade.A1[1]) {
                                    subject.grade = "A1"
                                    subject.gradeStatus = "Excellent"
                                } else if (subject.totalScore >= req.body.firstGrade.B2[0] && subject.totalScore <= req.body.firstGrade.B2[1]) {
                                    subject.grade = "B2"
                                    subject.gradeStatus = "Very Good"
                                } else if (subject.totalScore >= req.body.firstGrade.B3[0] && subject.totalScore <= req.body.firstGrade.B3[1]) {
                                    subject.grade = "B3"
                                    subject.gradeStatus = "Good"
                                } else if (subject.totalScore >= req.body.firstGrade.C4[0] && subject.totalScore <= req.body.firstGrade.C4[1]) {
                                    subject.grade = "C4"
                                    subject.gradeStatus = "Credit"
                                } else if (subject.totalScore >= req.body.firstGrade.C5[0] && subject.totalScore <= req.body.firstGrade.C5[1]) {
                                    subject.grade = "C5"
                                    subject.gradeStatus = "Credit"
                                } else if (subject.totalScore >= req.body.firstGrade.C6[0] && subject.totalScore <= req.body.firstGrade.C6[1]) {
                                    subject.grade = "C6"
                                    subject.gradeStatus = "Credit"
                                } else if (subject.totalScore >= req.body.firstGrade.D7[0] && subject.totalScore <= req.body.firstGrade.D7[1]) {
                                    subject.grade = "D7"
                                    subject.gradeStatus = "Pass"
                                } else if (subject.totalScore >= req.body.firstGrade.E8[0] && subject.totalScore <= req.body.firstGrade.E8[1]) {
                                    subject.grade = "E8"
                                    subject.gradeStatus = "Pass"
                                } else if (subject.totalScore >= req.body.firstGrade.F9[0] && subject.totalScore <= req.body.firstGrade.F9[1]) {
                                    subject.grade = "F9"
                                    subject.gradeStatus = "Fail"
                                }
                            }

                        })

                    }
                } else if (req.body.studentClass === "Sss3") {
                    if (req.body.term === 1) {
                        result.sss3.firstTermResult.map((subject, id) => {
                            if (subject.subject === req.body.subject) {
                                const fomerscoreMinus = subject.resultNameXResultScore[req.body.id].valuePoint
                                subject.totalScore = Number(subject.totalScore) - Number(fomerscoreMinus)
                                subject.totalScore = Number(subject.totalScore) + Number(req.body.newValuePoint)

                                subject.resultNameXResultScore[req.body.id].valuePoint = req.body.newValuePoint

                                if (subject.totalScore >= req.body.firstGrade.A1[0] && subject.totalScore <= req.body.firstGrade.A1[1]) {
                                    subject.grade = "A1"
                                    subject.gradeStatus = "Excellent"
                                } else if (subject.totalScore >= req.body.firstGrade.B2[0] && subject.totalScore <= req.body.firstGrade.B2[1]) {
                                    subject.grade = "B2"
                                    subject.gradeStatus = "Very Good"
                                } else if (subject.totalScore >= req.body.firstGrade.B3[0] && subject.totalScore <= req.body.firstGrade.B3[1]) {
                                    subject.grade = "B3"
                                    subject.gradeStatus = "Good"
                                } else if (subject.totalScore >= req.body.firstGrade.C4[0] && subject.totalScore <= req.body.firstGrade.C4[1]) {
                                    subject.grade = "C4"
                                    subject.gradeStatus = "Credit"
                                } else if (subject.totalScore >= req.body.firstGrade.C5[0] && subject.totalScore <= req.body.firstGrade.C5[1]) {
                                    subject.grade = "C5"
                                    subject.gradeStatus = "Credit"
                                } else if (subject.totalScore >= req.body.firstGrade.C6[0] && subject.totalScore <= req.body.firstGrade.C6[1]) {
                                    subject.grade = "C6"
                                    subject.gradeStatus = "Credit"
                                } else if (subject.totalScore >= req.body.firstGrade.D7[0] && subject.totalScore <= req.body.firstGrade.D7[1]) {
                                    subject.grade = "D7"
                                    subject.gradeStatus = "Pass"
                                } else if (subject.totalScore >= req.body.firstGrade.E8[0] && subject.totalScore <= req.body.firstGrade.E8[1]) {
                                    subject.grade = "E8"
                                    subject.gradeStatus = "Pass"
                                } else if (subject.totalScore >= req.body.firstGrade.F9[0] && subject.totalScore <= req.body.firstGrade.F9[1]) {
                                    subject.grade = "F9"
                                    subject.gradeStatus = "Fail"
                                }

                            }

                        })
                    } else if (req.body.term === 2) {
                        result.sss3.secondTermResult.map((subject, id) => {
                            if (subject.subject === req.body.subject) {
                                const fomerscoreMinus = subject.resultNameXResultScore[req.body.id].valuePoint
                                subject.totalScore = Number(subject.totalScore) - Number(fomerscoreMinus)
                                subject.totalScore = Number(subject.totalScore) + Number(req.body.newValuePoint)

                                subject.resultNameXResultScore[req.body.id].valuePoint = req.body.newValuePoint

                                if (subject.totalScore >= req.body.firstGrade.A1[0] && subject.totalScore <= req.body.firstGrade.A1[1]) {
                                    subject.grade = "A1"
                                    subject.gradeStatus = "Excellent"
                                } else if (subject.totalScore >= req.body.firstGrade.B2[0] && subject.totalScore <= req.body.firstGrade.B2[1]) {
                                    subject.grade = "B2"
                                    subject.gradeStatus = "Very Good"
                                } else if (subject.totalScore >= req.body.firstGrade.B3[0] && subject.totalScore <= req.body.firstGrade.B3[1]) {
                                    subject.grade = "B3"
                                    subject.gradeStatus = "Good"
                                } else if (subject.totalScore >= req.body.firstGrade.C4[0] && subject.totalScore <= req.body.firstGrade.C4[1]) {
                                    subject.grade = "C4"
                                    subject.gradeStatus = "Credit"
                                } else if (subject.totalScore >= req.body.firstGrade.C5[0] && subject.totalScore <= req.body.firstGrade.C5[1]) {
                                    subject.grade = "C5"
                                    subject.gradeStatus = "Credit"
                                } else if (subject.totalScore >= req.body.firstGrade.C6[0] && subject.totalScore <= req.body.firstGrade.C6[1]) {
                                    subject.grade = "C6"
                                    subject.gradeStatus = "Credit"
                                } else if (subject.totalScore >= req.body.firstGrade.D7[0] && subject.totalScore <= req.body.firstGrade.D7[1]) {
                                    subject.grade = "D7"
                                    subject.gradeStatus = "Pass"
                                } else if (subject.totalScore >= req.body.firstGrade.E8[0] && subject.totalScore <= req.body.firstGrade.E8[1]) {
                                    subject.grade = "E8"
                                    subject.gradeStatus = "Pass"
                                } else if (subject.totalScore >= req.body.firstGrade.F9[0] && subject.totalScore <= req.body.firstGrade.F9[1]) {
                                    subject.grade = "F9"
                                    subject.gradeStatus = "Fail"
                                }
                            }

                        })

                    } else if (req.body.term === 3) {
                        result.sss3.thirdTermResult.map((subject, id) => {
                            if (subject.subject === req.body.subject) {
                                const fomerscoreMinus = subject.resultNameXResultScore[req.body.id].valuePoint
                                subject.totalScore = Number(subject.totalScore) - Number(fomerscoreMinus)
                                subject.totalScore = Number(subject.totalScore) + Number(req.body.newValuePoint)

                                subject.resultNameXResultScore[req.body.id].valuePoint = req.body.newValuePoint

                                if (subject.totalScore >= req.body.firstGrade.A1[0] && subject.totalScore <= req.body.firstGrade.A1[1]) {
                                    subject.grade = "A1"
                                    subject.gradeStatus = "Excellent"
                                } else if (subject.totalScore >= req.body.firstGrade.B2[0] && subject.totalScore <= req.body.firstGrade.B2[1]) {
                                    subject.grade = "B2"
                                    subject.gradeStatus = "Very Good"
                                } else if (subject.totalScore >= req.body.firstGrade.B3[0] && subject.totalScore <= req.body.firstGrade.B3[1]) {
                                    subject.grade = "B3"
                                    subject.gradeStatus = "Good"
                                } else if (subject.totalScore >= req.body.firstGrade.C4[0] && subject.totalScore <= req.body.firstGrade.C4[1]) {
                                    subject.grade = "C4"
                                    subject.gradeStatus = "Credit"
                                } else if (subject.totalScore >= req.body.firstGrade.C5[0] && subject.totalScore <= req.body.firstGrade.C5[1]) {
                                    subject.grade = "C5"
                                    subject.gradeStatus = "Credit"
                                } else if (subject.totalScore >= req.body.firstGrade.C6[0] && subject.totalScore <= req.body.firstGrade.C6[1]) {
                                    subject.grade = "C6"
                                    subject.gradeStatus = "Credit"
                                } else if (subject.totalScore >= req.body.firstGrade.D7[0] && subject.totalScore <= req.body.firstGrade.D7[1]) {
                                    subject.grade = "D7"
                                    subject.gradeStatus = "Pass"
                                } else if (subject.totalScore >= req.body.firstGrade.E8[0] && subject.totalScore <= req.body.firstGrade.E8[1]) {
                                    subject.grade = "E8"
                                    subject.gradeStatus = "Pass"
                                } else if (subject.totalScore >= req.body.firstGrade.F9[0] && subject.totalScore <= req.body.firstGrade.F9[1]) {
                                    subject.grade = "F9"
                                    subject.gradeStatus = "Fail"
                                }
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
            } else {
                res.send({ message: "an error occured finding", status: false })
            }
        }
    })
}



///deactivateStudent from a set 
const deactivate = (req, res) => {
    studentModel.findOne({ _id: req.body.studentId }, (err, result) => {
        if (err) {
            return res.send({ status: false, message: "an error occured" })
        } else {
            if (result !== null) {
                let status = false
                if (req.body.currentClass === "Jss1") {
                    result.jss1Id = ""
                    result.jss1 = {}
                    status = true

                } else if (req.body.currentClass === "Jss2") {
                    result.jss2Id = ""
                    result.jss2 = {}
                    status = true
                } else if (req.body.currentClass === "Jss3") {
                    result.jss3Id = ""
                    result.jss3 = {}
                    status = true
                } else if (currentClass === "Sss1") {
                    result.sss1Id = ""
                    result.sss1 = {}

                } else if (req.body.currentClass === "Sss2") {
                    result.jss1Id = ""
                    result.jss1 = {}

                } else if (req.body.currentClass === "Sss3") {
                    result.jss1Id = ""
                    result.jss1 = {}

                }
                if (status) {
                    studentModel.findByIdAndUpdate({ _id: req.body.studentId }, result, (err) => {
                        if (err) {
                            return res.send({ status: false, message: "an error occured deactivating" })
                        } else {
                            return res.send({ status: true, message: "student deactivated succesfully" })
                        }
                    })
                }


            } else {
                res.send({ message: "couldn't find user", status: false })
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
    editValuePoint,
    deactivate,
}