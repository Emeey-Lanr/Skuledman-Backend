const res = require("express/lib/response")
const { format } = require("express/lib/response")
const mongoose = require("mongoose")
const setSchemaModel = require("../Models/set")
const studentModel = require("../Models/Student")

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
    console.log(infoComing)
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
                    currentClassInfo = studentFound.sss1
                } else if (infoComing[2] === "Sss3") {
                    currentClassInfo = studentFound.sss1
                }
                setSchemaModel.findOne({ _id: infoComing[0] }, (err, result) => {
                    if (err) {
                        res.send({ message: "an err occured", status: false })
                    } else {
                        console.log(result)
                        if (result !== null) {
                            firstTermSchoolFee = result.firstTerm.schoolFees
                            secondTermSchoolFee = result.secondTerm.schoolFees
                            thirdTermSchoolFee = result.thirdTerm.schoolFees
                            firstTermPtaFee = result.firstTerm.ptaFees
                            secondTermPtaFee = result.secondTerm.ptaFees,
                                thirdTermPtaFee = result.thirdTerm.ptaFees
                        }
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
                    }
                })

            }

        }
    })

}


const activateStatus = (req, res) => {
    studentModel.findOne({ _id: req.body.studentId }, (err, result) => {
        if (err) {
            res.send({ message: "an err occured", status: false })
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
                        res.send({ message: "an error occured, unable to upadte", status: false })
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
    activateStatus


}