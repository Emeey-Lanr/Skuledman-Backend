const mongoose = require("mongoose")
const setSchemaModel = require("../Models/set")
const studentModel = require("../Models/Student")
const schoolModel = require("../Models/schoolModel")
const nodemailer = require("nodemailer")

// const res = require("express/lib/response")

let check = false
let schoolid = ""
const saveSet = (req, res) => {
    let setForm = new setSchemaModel(req.body)

    setSchemaModel.find({ schoolId: req.body.schoolId }, (err, result) => {
        if (err) {
            res.send({ message: "an error occured", status: false })
        } else {
            let Class = result.filter((sets, id) => sets.class === req.body.class)
            Class.map((sets, id) => {
                if (sets.set === req.body.set) {
                    check = true
                }
            })

        }

        if (check) {
            res.send({ message: "A set already exist with this set year", status: false })
            console.log("user already exist")
        } else {
            setForm.save((err) => {
                if (err) {
                    console.log(err)
                    res.send({ message: "unable to create", status: false })
                } else {
                    res.send({ message: "set saved succesfully", status: true })
                    schoolid = req.body.schoolId
                }
            })
        }
    })

}


const getSet = (req, res) => {
    let schoolId = req.headers.authorization.split(" ")[1]
    setSchemaModel.find({ schoolId: schoolId }, (err, result) => {
        if (err) {
            res.send({ status: false, message: "an error happened" })
        } else {
            const jss1 = result.filter((sets, id) => sets.class === "Jss1")
            const jss2 = result.filter((sets, id) => sets.class === "Jss2")
            const jss3 = result.filter((sets, id) => sets.class === "Jss3")
            const ss1 = result.filter((sets, id) => sets.class === "Sss1")
            const ss2 = result.filter((sets, id) => sets.class === "Sss2")
            const ss3 = result.filter((sets, id) => sets.class === "Sss3")
            res.send({ status: true, set1: jss1, set2: jss2, set3: jss3, set4: ss1, set5: ss2, set6: ss3 })
        }

    })
}

const getCurrentSet = (req, res) => {
    let schoolDetailsInfo = {}
    let firstTermStudent = []
    let secondTermStudent = []
    let thirdTermStudent = []
    let totalSchoolFeesForFirstTerm = 0
    let totalSchoolFeesForSecondTerm = 0
    let totalSchoolFeesForThirdTerm = 0
    let totalPtaFeesForFirstTerm = 0
    let totalPtaFeesForSecondTerm = 0
    let totalPtaFeesForThirdTerm = 0
    let studentTotalFirstTermPaid = 0
    let studentTotalSecondTermPaid = 0
    let studentTotalthirTermPaid = 0

    let studentTotalFirstPtaFeePaid = 0
    let studentTotalSecondPtaFeePaid = 0
    let studentTotalThirdPtaFeePaid = 0

    let debtOwnedFirstTermSchoolFees = 0
    let debtOwnedSecondTermSchoolFees = 0
    let debtOwnedThirdTermSchoolFees = 0
    ////Pta
    let debtOwnedFirstTermPtaFees = 0
    let debtOwnedSecondTermPtaFees = 0
    let debtOwnedThirdTermPtaFees = 0

    const currentSetId = req.headers.authorization.split(" ")[1]
    setSchemaModel.findOne({ _id: currentSetId }, (err, resultFound) => {
        if (err) {
            res.send({ message: "can't find set", status: false })
        } else {
            const findSchoolDetails = () => {
                schoolModel.findOne({ _id: resultFound.schoolId }, (err, schoolDetails) => {
                    return new Promise((resolve, reject) => {
                        if (err) {

                        } else {
                            schoolDetailsInfo = schoolDetails
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
            const calculateIfJss1 = () => {
                if (resultFound.class === "Jss1") {
                    return new Promise((resolve, reject) => {
                        studentModel.find({ jss1Id: resultFound._id }, (err, result) => {
                            if (err) {
                                res.send({ status: false, message: "an error occured" })
                            } else {

                                firstTermStudent = result.filter((student, id) => student.jss1.firstTermStatus === true)
                                secondTermStudent = result.filter((student, id) => student.jss1.secondTermStatus === true)
                                thirdTermStudent = result.filter((student, id) => student.jss1.thirdTermStatus === true)

                                totalSchoolFeesForFirstTerm = Number(firstTermStudent.length) * Number(resultFound.firstTerm.schoolFees)
                                totalSchoolFeesForSecondTerm = Number(secondTermStudent.length) * Number(resultFound.secondTerm.schoolFees)
                                totalSchoolFeesForThirdTerm = Number(thirdTermStudent.length) * Number(resultFound.thirdTerm.schoolFees)
                                totalPtaFeesForFirstTerm = Number(firstTermStudent.length) * Number(resultFound.firstTerm.ptaFees)
                                totalPtaFeesForSecondTerm = Number(firstTermStudent.length) * Number(resultFound.secondTerm.ptaFees)
                                totalPtaFeesForThirdTerm = Number(firstTermStudent.length) * Number(resultFound.thirdTerm.ptaFees)

                                //to check the total paid so far
                                if (firstTermStudent.length > 0) {
                                    firstTermStudent.map((student, id) => {
                                        studentTotalFirstTermPaid += Number(student.jss1.firstTermSchoolFees)
                                        studentTotalFirstPtaFeePaid += Number(student.jss1.firstTermPtaFees)
                                    })
                                }
                                if (secondTermStudent.length > 0) {
                                    secondTermStudent.map((student, id) => {
                                        studentTotalSecondTermPaid += Number(student.jss1.secondTermSchoolFees)
                                        studentTotalSecondPtaFeePaid += Number(student.jss1.secondTermPtaFees)
                                    })
                                }
                                if (thirdTermStudent.length > 0) {
                                    thirdTermStudent.map((student, id) => {
                                        studentTotalthirTermPaid += Number(student.jss1.thirdTermSchoolFees)
                                        studentTotalThirdPtaFeePaid += Number(student.jss1.thirdTermPtaFees)
                                    })
                                }

                                ///school debt
                                debtOwnedFirstTermSchoolFees = Number(totalSchoolFeesForFirstTerm) - Number(studentTotalFirstTermPaid)
                                debtOwnedSecondTermSchoolFees = Number(totalSchoolFeesForSecondTerm) - Number(studentTotalSecondTermPaid)
                                debtOwnedThirdTermSchoolFees = Number(totalSchoolFeesForThirdTerm) - Number(studentTotalthirTermPaid)
                                ////Pta
                                debtOwnedFirstTermPtaFees = Number(totalPtaFeesForFirstTerm) - Number(studentTotalFirstPtaFeePaid)
                                debtOwnedSecondTermPtaFees = Number(totalPtaFeesForSecondTerm) - Number(studentTotalSecondPtaFeePaid)
                                debtOwnedThirdTermPtaFees = Number(totalPtaFeesForThirdTerm) - Number(studentTotalThirdPtaFeePaid)



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
            const calculateIfJss2 = () => {
                if (resultFound.class === "Jss2") {
                    return new Promise((resolve, reject) => {
                        studentModel.find({ jss2Id: resultFound._id }, (err, result) => {
                            if (err) {
                                res.send({ status: false, message: "an error occured" })
                            } else {
                                if (result !== null) {

                                    firstTermStudent = result.filter((student, id) => student.jss2.firstTermStatus === true)
                                    secondTermStudent = result.filter((student, id) => student.jss2.secondTermStatus === true)
                                    thirdTermStudent = result.filter((student, id) => student.jss2.thirdTermStatus === true)
                                    totalSchoolFeesForFirstTerm = Number(firstTermStudent.length) * Number(resultFound.firstTerm.schoolFees)
                                    totalSchoolFeesForSecondTerm = Number(secondTermStudent.length) * Number(resultFound.secondTerm.schoolFees)
                                    totalSchoolFeesForThirdTerm = Number(thirdTermStudent.length) * Number(resultFound.thirdTerm.schoolFees)
                                    totalPtaFeesForFirstTerm = Number(firstTermStudent.length) * Number(resultFound.firstTerm.ptaFees)
                                    totalPtaFeesForSecondTerm = Number(firstTermStudent.length) * Number(resultFound.secondTerm.ptaFees)
                                    totalPtaFeesForThirdTerm = Number(firstTermStudent.length) * Number(resultFound.thirdTerm.ptaFees)
                                    if (firstTermStudent.length > 0) {
                                        firstTermStudent.map
                                            ((student, id) => {
                                                studentTotalFirstTermPaid += Number(student.jss2.firstTermSchoolFees)
                                                studentTotalFirstPtaFeePaid += Number(student.jss2.firstTermPtaFees)
                                            })
                                    }
                                    if (secondTermStudent.length > 0) {
                                        secondTermStudent.map((student, id) => {
                                            studentTotalSecondTermPaid += Number(student.jss2.secondTermSchoolFees)
                                            studentTotalSecondPtaFeePaid += Number(student.jss2.secondTermPtaFees)
                                        })
                                    }
                                    if (thirdTermStudent.length > 0) {
                                        thirdTermStudent.map((student, id) => {
                                            studentTotalthirTermPaid += Number(student.jss2.thirdTermSchoolFees)
                                            studentTotalThirdPtaFeePaid += Number(student.jss2.thirdTermPtaFees)
                                        })
                                    }
                                    ///school debt
                                    debtOwnedFirstTermSchoolFees = totalSchoolFeesForFirstTerm - studentTotalFirstTermPaid
                                    debtOwnedSecondTermSchoolFees = totalSchoolFeesForSecondTerm - studentTotalSecondTermPaid
                                    debtOwnedThirdTermSchoolFees = totalSchoolFeesForThirdTerm - studentTotalthirTermPaid
                                    ////Pta
                                    debtOwnedFirstTermPtaFees = totalPtaFeesForFirstTerm - studentTotalFirstPtaFeePaid
                                    debtOwnedSecondTermPtaFees = totalPtaFeesForSecondTerm - studentTotalSecondPtaFeePaid
                                    debtOwnedThirdTermPtaFees = totalPtaFeesForThirdTerm - studentTotalThirdPtaFeePaid

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
            const calculateIfJss3 = () => {
                if (resultFound.class === "Jss3") {
                    return new Promise((resolve, reject) => {
                        studentModel.find({ jss3Id: resultFound._id }, (err, result) => {
                            if (err) {
                                res.send({ status: false, message: "an error occured" })
                            } else {

                                firstTermStudent = result.filter((student, id) => student.jss3.firstTermStatus === true)
                                secondTermStudent = result.filter((student, id) => student.jss3.secondTermStatus === true)
                                thirdTermStudent = result.filter((student, id) => student.jss3.thirdTermStatus === true)
                                totalSchoolFeesForFirstTerm = Number(firstTermStudent.length) * Number(resultFound.firstTerm.schoolFees)
                                totalSchoolFeesForSecondTerm = Number(secondTermStudent.length) * Number(resultFound.secondTerm.schoolFees)
                                totalSchoolFeesForThirdTerm = Number(thirdTermStudent.length) * Number(resultFound.thirdTerm.schoolFees)
                                totalPtaFeesForFirstTerm = Number(firstTermStudent.length) * Number(resultFound.firstTerm.ptaFees)
                                totalPtaFeesForSecondTerm = Number(firstTermStudent.length) * Number(resultFound.secondTerm.ptaFees)
                                totalPtaFeesForThirdTerm = Number(firstTermStudent.length) * Number(resultFound.thirdTerm.ptaFees)
                                if (firstTermStudent.length > 0) {
                                    firstTermStudent.map((student, id) => {
                                        studentTotalFirstTermPaid += Number(student.jss3.firstTermSchoolFees)
                                        studentTotalFirstPtaFeePaid += Number(student.jss3.firstTermPtaFees)
                                    })
                                }
                                if (secondTermStudent.length > 0) {
                                    secondTermStudent.map((student, id) => {
                                        studentTotalSecondTermPaid += Number(student.jss3.secondTermSchoolFees)
                                        studentTotalSecondPtaFeePaid += Number(student.jss3.secondTermPtaFees)
                                    })
                                }
                                if (thirdTermStudent.length > 0) {
                                    thirdTermStudent.map((student, id) => {
                                        studentTotalthirTermPaid += Number(student.jss3.thirdTermSchoolFees)
                                        studentTotalThirdPtaFeePaid += Number(student.jss3.thirdTermPtaFees)
                                    })
                                }
                                ///school debt
                                debtOwnedFirstTermSchoolFees = totalSchoolFeesForFirstTerm - studentTotalFirstTermPaid
                                debtOwnedSecondTermSchoolFees = totalSchoolFeesForSecondTerm - studentTotalSecondTermPaid
                                debtOwnedThirdTermSchoolFees = totalSchoolFeesForThirdTerm - studentTotalthirTermPaid
                                ////Pta
                                debtOwnedFirstTermPtaFees = totalPtaFeesForFirstTerm - studentTotalFirstPtaFeePaid
                                debtOwnedSecondTermPtaFees = totalPtaFeesForSecondTerm - studentTotalSecondPtaFeePaid
                                debtOwnedThirdTermPtaFees = totalPtaFeesForThirdTerm - studentTotalThirdPtaFeePaid

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
            const calculateIfSss1 = () => {
                if (resultFound.class === "Sss1") {
                    return new Promise((resolve, reject) => {
                        studentModel.find({ sss1Id: resultFound._id }, (err, result) => {
                            if (err) {
                                res.send({ status: false, message: "an error occured" })
                            } else {

                                firstTermStudent = result.filter((student, id) => student.sss1.firstTermStatus === true)
                                secondTermStudent = result.filter((student, id) => student.sss1.secondTermStatus === true)
                                thirdTermStudent = result.filter((student, id) => student.sss1.thirdTermStatus === true)
                                totalSchoolFeesForFirstTerm = Number(firstTermStudent.length) * Number(resultFound.firstTerm.schoolFees)
                                totalSchoolFeesForSecondTerm = Number(secondTermStudent.length) * Number(resultFound.secondTerm.schoolFees)
                                totalSchoolFeesForThirdTerm = Number(thirdTermStudent.length) * Number(resultFound.thirdTerm.schoolFees)
                                totalPtaFeesForFirstTerm = Number(firstTermStudent.length) * Number(resultFound.firstTerm.ptaFees)
                                totalPtaFeesForSecondTerm = Number(firstTermStudent.length) * Number(resultFound.secondTerm.ptaFees)
                                totalPtaFeesForThirdTerm = Number(firstTermStudent.length) * Number(resultFound.thirdTerm.ptaFees)
                                if (firstTermStudent.length > 0) {
                                    firstTermStudent.map((student, id) => {
                                        studentTotalFirstTermPaid += Number(student.sss1.firstTermSchoolFees)
                                        studentTotalFirstPtaFeePaid += Number(student.sss1.firstTermPtaFees)
                                    })
                                }
                                if (secondTermStudent.length > 0) {
                                    secondTermStudent.map((student, id) => {
                                        studentTotalSecondTermPaid += Number(student.sss1.secondTermSchoolFees)
                                        studentTotalSecondPtaFeePaid += Number(student.sss1.secondTermPtaFees)
                                    })
                                }
                                if (thirdTermStudent.length > 0) {
                                    thirdTermStudent.map((student, id) => {
                                        studentTotalthirTermPaid += Number(student.sss1.thirdTermSchoolFees)
                                        studentTotalThirdPtaFeePaid += Number(student.sss1.thirdTermPtaFees)
                                    })
                                }
                                ///school debt
                                debtOwnedFirstTermSchoolFees = totalSchoolFeesForFirstTerm - studentTotalFirstTermPaid
                                debtOwnedSecondTermSchoolFees = totalSchoolFeesForSecondTerm - studentTotalSecondTermPaid
                                debtOwnedThirdTermSchoolFees = totalSchoolFeesForThirdTerm - studentTotalthirTermPaid
                                ////Pta
                                debtOwnedFirstTermPtaFees = totalPtaFeesForFirstTerm - studentTotalFirstPtaFeePaid
                                debtOwnedSecondTermPtaFees = totalPtaFeesForSecondTerm - studentTotalSecondPtaFeePaid
                                debtOwnedThirdTermPtaFees = totalPtaFeesForThirdTerm - studentTotalThirdPtaFeePaid

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
            const calculateIfSss2 = () => {
                if (resultFound.class === "Sss2") {
                    return new Promise((resolve, reject) => {
                        studentModel.find({ sss2Id: resultFound._id }, (err, result) => {
                            if (err) {
                                res.send({ status: false, message: "an error occured" })
                            } else {

                                firstTermStudent = result.filter((student, id) => student.sss2.firstTermStatus === true)
                                secondTermStudent = result.filter((student, id) => student.sss2.secondTermStatus === true)
                                thirdTermStudent = result.filter((student, id) => student.sss2.thirdTermStatus === true)
                                totalSchoolFeesForFirstTerm = Number(firstTermStudent.length) * Number(resultFound.firstTerm.schoolFees)
                                totalSchoolFeesForSecondTerm = Number(secondTermStudent.length) * Number(resultFound.secondTerm.schoolFees)
                                totalSchoolFeesForThirdTerm = Number(thirdTermStudent.length) * Number(resultFound.thirdTerm.schoolFees)
                                totalPtaFeesForFirstTerm = Number(firstTermStudent.length) * Number(resultFound.firstTerm.ptaFees)
                                totalPtaFeesForSecondTerm = Number(firstTermStudent.length) * Number(resultFound.secondTerm.ptaFees)
                                totalPtaFeesForThirdTerm = Number(firstTermStudent.length) * Number(resultFound.thirdTerm.ptaFees)

                                if (firstTermStudent.length > 0) {
                                    firstTermStudent.map((student, id) => {
                                        studentTotalFirstTermPaid += Number(student.sss2.firstTermSchoolFees)
                                        studentTotalFirstPtaFeePaid += Number(student.sss2.firstTermPtaFees)
                                    })
                                }
                                if (secondTermStudent.length > 0) {
                                    secondTermStudent.map((student, id) => {
                                        studentTotalSecondTermPaid += Number(student.sss2.secondTermSchoolFees)
                                        studentTotalSecondPtaFeePaid += Number(student.sss2.secondTermPtaFees)
                                    })
                                }
                                if (thirdTermStudent.length > 0) {
                                    thirdTermStudent.map((student, id) => {
                                        studentTotalthirTermPaid += Number(student.sss2.thirdTermSchoolFees)
                                        studentTotalThirdPtaFeePaid += Number(student.sss2.thirdTermPtaFees)
                                    })
                                }

                                ///school debt
                                debtOwnedFirstTermSchoolFees = totalSchoolFeesForFirstTerm - studentTotalFirstTermPaid
                                debtOwnedSecondTermSchoolFees = totalSchoolFeesForSecondTerm - studentTotalSecondTermPaid
                                debtOwnedThirdTermSchoolFees = totalSchoolFeesForThirdTerm - studentTotalthirTermPaid
                                ////Pta
                                debtOwnedFirstTermPtaFees = totalPtaFeesForFirstTerm - studentTotalFirstPtaFeePaid
                                debtOwnedSecondTermPtaFees = totalPtaFeesForSecondTerm - studentTotalSecondPtaFeePaid
                                debtOwnedThirdTermPtaFees = totalPtaFeesForThirdTerm - studentTotalThirdPtaFeePaid

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
            const calculateIfSss3 = () => {
                if (resultFound.class === "Sss3") {
                    return new Promise((resolve, reject) => {
                        studentModel.find({ sss3Id: resultFound._id }, (err, result) => {
                            if (err) {
                                res.send({ status: false, message: "an error occured" })
                            } else {
                                firstTermStudent = result.filter((student, id) => student.sss3.firstTermStatus === true)
                                secondTermStudent = result.filter((student, id) => student.sss3.secondTermStatus === true)
                                thirdTermStudent = result.filter((student, id) => student.sss3.thirdTermStatus === true)
                                totalSchoolFeesForFirstTerm = Number(firstTermStudent.length) * Number(resultFound.firstTerm.schoolFees)
                                totalSchoolFeesForSecondTerm = Number(secondTermStudent.length) * Number(resultFound.secondTerm.schoolFees)
                                totalSchoolFeesForThirdTerm = Number(thirdTermStudent.length) * Number(resultFound.thirdTerm.schoolFees)
                                totalPtaFeesForFirstTerm = Number(firstTermStudent.length) * Number(resultFound.firstTerm.ptaFees)
                                totalPtaFeesForSecondTerm = Number(firstTermStudent.length) * Number(resultFound.secondTerm.ptaFees)
                                totalPtaFeesForThirdTerm = Number(firstTermStudent.length) * Number(resultFound.thirdTerm.ptaFees)

                                if (firstTermStudent.length > 0) {
                                    firstTermStudent.map((student, id) => {
                                        studentTotalFirstTermPaid += Number(student.sss3.firstTermSchoolFees)
                                        studentTotalFirstPtaFeePaid += Number(student.sss3.firstTermPtaFees)
                                    })
                                }
                                if (secondTermStudent.length > 0) {
                                    secondTermStudent.map((student, id) => {
                                        studentTotalSecondTermPaid += Number(student.sss3.secondTermSchoolFees)
                                        studentTotalSecondPtaFeePaid += Number(student.sss3.secondTermPtaFees)
                                    })
                                }
                                if (thirdTermStudent.length > 0) {
                                    thirdTermStudent.map((student, id) => {
                                        studentTotalthirTermPaid += Number(student.sss3.thirdTermSchoolFees)
                                        studentTotalThirdPtaFeePaid += Number(student.sss2.thirdTermPtaFees)
                                    })
                                }
                                ///school debt
                                debtOwnedFirstTermSchoolFees = totalSchoolFeesForFirstTerm - studentTotalFirstTermPaid
                                debtOwnedSecondTermSchoolFees = totalSchoolFeesForSecondTerm - studentTotalSecondTermPaid
                                debtOwnedThirdTermSchoolFees = totalSchoolFeesForThirdTerm - studentTotalthirTermPaid
                                ////Pta
                                debtOwnedFirstTermPtaFees = totalPtaFeesForFirstTerm - studentTotalFirstPtaFeePaid
                                debtOwnedSecondTermPtaFees = totalPtaFeesForSecondTerm - studentTotalSecondPtaFeePaid
                                debtOwnedThirdTermPtaFees = totalPtaFeesForThirdTerm - studentTotalThirdPtaFeePaid

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
            const runAfterCalculating = async () => {
                await findSchoolDetails()
                await calculateIfJss1()
                await calculateIfJss2()
                await calculateIfJss3()
                await calculateIfSss1()
                await calculateIfSss2()
                await calculateIfSss3()
                res.send({
                    schoolInfo: schoolDetailsInfo,
                    currentSet: resultFound,
                    ///Total amount to  be paid school fee
                    totalAmountToBePaidSchoolFeeFirstTerm: totalSchoolFeesForFirstTerm,
                    totalAmountToBePaidSchoolFeeSecondTerm: totalSchoolFeesForSecondTerm,
                    totalAmountToBePaidSchoolFeeThirsTerm: totalSchoolFeesForThirdTerm,

                    ///Total Amount to be paid pta fee
                    totalAmountToBePaidPtaFeeFirstTerm: totalPtaFeesForFirstTerm,
                    totalAmountToBePaidPtaFeeSecondTerm: totalPtaFeesForSecondTerm,
                    totalAmountToBePaidPtaFeeThirdTerm: totalPtaFeesForThirdTerm,

                    ///School debt Fees
                    firsTermDebtOwned: debtOwnedFirstTermSchoolFees,
                    secondTermDebtOwned: debtOwnedSecondTermSchoolFees,
                    thirdTermDebt: debtOwnedThirdTermSchoolFees,

                    ///SchoolFees Amount already paid
                    studentSFirstTermPaid: studentTotalFirstTermPaid,
                    studentSSecondTermPaid: studentTotalSecondTermPaid,
                    studentSThirdTermPaid: studentTotalthirTermPaid,


                    ///Pta Fees
                    firstTermDebtOwnedPta: debtOwnedFirstTermPtaFees,
                    secondTermDebtOwnedPta: debtOwnedSecondTermPtaFees,
                    thirdTermDebtOwnedPta: debtOwnedThirdTermPtaFees,

                    ////Pta Fee amount fee paid
                    studentPFirstTermPaid: studentTotalFirstPtaFeePaid,
                    studentPSecondTermPaid: studentTotalSecondPtaFeePaid,
                    studentPThirdTermPaid: studentTotalThirdPtaFeePaid,



                    ////Number of student
                    firstnumberOfStudent: firstTermStudent.length,
                    secondTotalNumberOfStudent: secondTermStudent.length,
                    thirdTotalNumberOfStudent: thirdTermStudent.length,
                    status: true
                })


            }
            runAfterCalculating()
        }
    })
}




const deleteSet = (req, res) => {
    const infoComing = req.body.info.split(",")
    setSchemaModel.findOneAndDelete({ _id: infoComing[0] }, (err, result) => {
        if (err) {
            res.send({ message: "unable to delete", status: false })
        } else {
            res.send({ message: "deleted", status: true })
        }
    })
}

const updatePTAFeeAndSchoolFees = (req, res) => {
    setSchemaModel.findOne({ _id: req.body.setId }, (err, result) => {
        if (err) {
            res.send({ message: "An error occured", status: false })
        } else {
            if (req.body.term === "firstTerm") {
                if (req.body.schoolFees === "") {
                    result.firstTerm["ptaFees"] = req.body.ptaFees
                } else if (req.body.ptaFees === "") {
                    result.firstTerm["schoolFees"] = req.body.schoolFees
                } else {
                    result.firstTerm["ptaFees"] = req.body.ptaFees
                    result.firstTerm["schoolFees"] = req.body.schoolFees
                }

                setSchemaModel.findOneAndUpdate({ _id: req.body.setId }, result, (err) => {
                    if (err) {
                        res.send({ message: "unable to update", status: false })
                    } else {
                        res.send({ message: "updated succesfully", status: true })
                    }
                })
            } else if (req.body.term === "secondTerm") {
                // 
                // 
                if (req.body.schoolFees === "") {
                    result.secondTerm["ptaFees"] = req.body.ptaFees
                } else if (req.body.ptaFees === "") {
                    result.secondTerm["schoolFees"] = req.body.schoolFees
                } else {
                    result.secondTerm["schoolFees"] = req.body.schoolFees
                    result.secondTerm["ptaFees"] = req.body.ptaFees
                }
                setSchemaModel.findOneAndUpdate({ _id: req.body.setId }, result, (err) => {
                    if (err) {
                        res.send({ message: "unable to update", status: false })
                    } else {
                        res.send({ message: "updated succesfully", status: true })
                    }
                })


            } else if (req.body.term === "thirdTerm") {

                if (req.body.schoolFees === "") {
                    result.thirdTerm["ptaFees"] = req.body.ptaFees
                } else if (req.body.ptaFees === "") {
                    result.thirdTerm["schoolFees"] = req.body.schoolFees
                } else {
                    result.thirdTerm["ptaFees"] = req.body.ptaFees
                    result.thirdTerm["schoolFees"] = req.body.schoolFees
                }
                setSchemaModel.findOneAndUpdate({ _id: req.body.setId }, result, (err) => {
                    if (err) {
                        res.send({ message: "unable to update", status: false })
                    } else {
                        res.send({ message: "updated succesfully", status: true })
                    }
                })

            }

        }
    })

}


///Creation of list 
const createFeeList = (req, res) => {

    setSchemaModel.findOne({ _id: req.body.setInfo["setid"] }, (err, result) => {
        if (err) {
            res.send({ status: false, message: "an error occured" })
        } else {
            if (result !== null) {
                if (req.body.setInfo["currentTerm"] === "firstTerm") {
                    result.firstTerm["otherFee"].push(req.body["morelist"])

                } else if (req.body.setInfo["currentTerm"] === "secondTerm") {
                    result.secondTerm["otherFee"].push(req.body["morelist"])

                } else if (req.body.setInfo["currentTerm"] === "thirdTerm") {
                    result.thirdTerm["otherFee"].push(req.body["morelist"])

                }
                setSchemaModel.findByIdAndUpdate({ _id: req.body.setInfo["setid"] }, result, (err) => {
                    if (err) {
                        res.send({ message: "an error occured updating", status: false })
                    } else {
                        res.send({ message: "updated succesfully", status: true })
                    }
                })
            }

        }
    })
}

const editPriceList = (req, res) => {
    setSchemaModel.findOne({ _id: req.body.setId }, (err, result) => {
        if (err) {
            return res.send({ message: "an error occured", status: false })
        } else {
            if (result !== null) {
                if (req.body.term === "firstTerm") {
                    result.firstTerm.otherFee[req.body.feeId] = req.body.editedList
                    setSchemaModel.findByIdAndUpdate({ _id: req.body.setId }, result, (err) => {
                        if (err) {
                            return res.send({ message: "an error occured updating", status: false })
                        } else {
                            return res.send({ message: "edited succefully", status: true })
                        }
                    })
                } else if (req.body.term === "secondTerm") {
                    result.secondTerm.otherFee[req.body.feeId] = req.body.editedList
                    setSchemaModel.findByIdAndUpdate({ _id: req.body.setId }, result, (err) => {
                        if (err) {
                            return res.send({ message: "an error occured updating", status: false })
                        } else {
                            return res.send({ message: "edited succefully", status: true })
                        }
                    })
                } else if (req.body.term === "thirdTerm") {
                    result.thirdTerm.otherFee[req.body.feeId] = req.body.editedList
                    setSchemaModel.findByIdAndUpdate({ _id: req.body.setId }, result, (err) => {
                        if (err) {
                            return res.send({ message: "an error occured updating", status: false })
                        } else {
                            return res.send({ message: "edited succefully", status: true })
                        }
                    })
                }
            }
        }
    })
}

const delPriceList = (req, res) => {
    setSchemaModel.findOne({ _id: req.body.setId }, (err, result) => {
        if (err) {
            res.send({ message: "an error occured", status: false })
        } else {
            if (result !== null) {
                if (req.body.term === "firstTerm") {
                    let newOtherFee = result.firstTerm.otherFee.filter((info, id) => info.description !== req.body.priceListName)
                    result.firstTerm.otherFee = newOtherFee
                } else if (req.body.term === "secondTerm") {
                    let newOtherFee = result.secondTerm.otherFee.filter((info, id) => info.description !== req.body.priceListName)
                    result.secondTerm.otherFee = newOtherFee
                } else if (req.body.term === "thirdTerm") {
                    let newOtherFee = result.thirdTerm.otherFee.filter((info, id) => info.description !== req.body.priceListName)
                    result.thirdTerm.otherFee = newOtherFee
                }
                setSchemaModel.findByIdAndUpdate({ _id: req.body.setId }, result, (err) => {
                    if (err) {
                        res.send({ message: "unable to delete", status: false })
                    } else {
                        res.send({ message: "deleted succesfully", status: true })
                    }
                })
            } else {
                res.send({ messsage: "an error occured when operating command", status: false })
            }
        }

    })

}
const sendMail = (req, res) => {
    const info = req.body.info.split(",")
    let status = false
    let userEmail = []
    let allEmail = ""

    if (req.body.class === "Jss1") {
        studentModel.find({ jss1Id: info[0] }, (err, result) => {
            if (err) {
                res.send({ message: "an error occured", status: false })
            } else {
                if (result.length > 0) {
                    userEmail = result.filter((info, id) => info.parentGmail !== "")
                    if (userEmail.length > 0) {
                        status = true

                        userEmail.map((info, id) => {
                            // allEmail += info.parentGmail + ","
                            var mailOptions = {
                                from: info[4],
                                to: info.parentGmail,
                                subject: `${req.body.subject}`,
                                text: '',
                                html: `<p>
                                ${req.body.message}
                                </p>`

                            }
                            transporter.sendMail(mailOptions, (err, result) => {
                                if (err) {
                                    res.send({ message: 'email not sentSuccesfully', status: false })
                                } else {
                                    res.send({ message: 'email sent succesfully', status: true, })

                                }
                            })
                        })
                    } else {
                        res.send({ message: "no gmail to send to", status: false })
                    }

                } else {
                    res.send({ message: "no student to send gmail to", status: false })
                }
            }

        })
    } else if (req.body.class === "Jss2") {
        studentModel.find({ jss2Id: info[0] }, (err, result) => {
            if (err) {
                res.send({ message: "an error occured", status: false })
            } else {
                if (result.length > 0) {
                    userEmail = result.filter((info, id) => info.parentGmail !== "")
                    if (userEmail.length > 0) {
                        status = true
                        userEmail.map((info, id) => {
                            var mailOptions = {
                                from: info[4],
                                to: info.parentGmail,
                                subject: `${req.body.subject}`,
                                text: '',
                                html: `<p>
                                    ${req.body.message}
                                    </p>`

                            }
                            transporter.sendMail(mailOptions, (err, result) => {
                                if (err) {
                                    res.send({ message: 'email not sentSuccesfully', status: false })
                                } else {
                                    res.send({ message: 'email sent succesfully', status: true, })

                                }
                            })


                        })
                    } else {
                        res.send({ message: "no gmail to send to", status: false })
                    }

                } else {
                    res.send({ message: "no student to send gmail to", status: false })
                }
            }
        })

    } else if (req.body.class === "Jss3") {
        studentModel.find({ jss3Id: info[0] }, (err, result) => {
            if (err) {
                res.send({ message: "an error occured", status: false })
            } else {
                if (result.length > 0) {
                    userEmail = result.filter((info, id) => info.parentGmail !== "")
                    if (userEmail.length > 0) {
                        status = true
                        userEmail.map((info, id) => {
                            var mailOptions = {
                                from: info[4],
                                to: info.parentGmail,
                                subject: `${req.body.subject}`,
                                text: '',
                                html: `<p>
                                    ${req.body.message}
                                    </p>`

                            }
                            transporter.sendMail(mailOptions, (err, result) => {
                                if (err) {
                                    res.send({ message: 'email not sentSuccesfully', status: false })
                                } else {
                                    res.send({ message: 'email sent succesfully', status: true, })

                                }
                            })
                        })
                    } else {
                        res.send({ message: "no gmail to send to", status: false })
                    }

                } else {
                    res.send({ message: "no student to send gmail to", status: false })
                }
            }
        })

    } else if (req.body.class === "Sss1") {
        studentModel.find({ sss1Id: info[0] }, (err, result) => {
            if (err) {
                res.send({ message: "an error occured", status: false })
            } else {
                if (result.length > 0) {
                    userEmail = result.filter((info, id) => info.parentGmail !== "")
                    if (userEmail.length > 0) {
                        status = true
                        userEmail.map((info, id) => {
                            var mailOptions = {
                                from: info[4],
                                to: info.parentGmail,
                                subject: `${req.body.subject}`,
                                text: '',
                                html: `<p>
                                    ${req.body.message}
                                    </p>`

                            }
                            transporter.sendMail(mailOptions, (err, result) => {
                                if (err) {
                                    res.send({ message: 'email not sentSuccesfully', status: false })
                                } else {
                                    res.send({ message: 'email sent succesfully', status: true, })

                                }
                            })
                        })
                    } else {
                        res.send({ message: "no gmail to send to", status: false })
                    }

                } else {
                    res.send({ message: "no student to send gmail to", status: false })
                }
            }
        })

    } else if (req.body.class === "Sss2") {
        studentModel.find({ sss2Id: info[0] }, (err, result) => {
            if (err) {
                res.send({ message: "an error occured", status: false })
            } else {
                if (result.length > 0) {
                    userEmail = result.filter((info, id) => info.parentGmail !== "")
                    if (userEmail.length > 0) {
                        status = true
                        userEmail.map((info, id) => {
                            var mailOptions = {
                                from: info[4],
                                to: info.parentGmail,
                                subject: `${req.body.subject}`,
                                text: '',
                                html: `<p>
                                    ${req.body.message}
                                    </p>`

                            }
                            transporter.sendMail(mailOptions, (err, result) => {
                                if (err) {
                                    res.send({ message: 'email not sentSuccesfully', status: false })
                                } else {
                                    res.send({ message: 'email sent succesfully', status: true, })

                                }
                            })
                        })
                    } else {
                        res.send({ message: "no gmail to send to", status: false })
                    }

                } else {
                    res.send({ message: "no student to send gmail to", status: false })
                }
            }
        })
    } else if (req.body.class === "Sss3") {
        studentModel.find({ sss3Id: info[0] }, (err, result) => {
            if (err) {
                res.send({ message: "an error occured", status: false })
            } else {
                if (result.length > 0) {
                    userEmail = result.filter((info, id) => info.parentGmail !== "")
                    if (userEmail.length > 0) {
                        status = true
                        userEmail.map((info, id) => {
                            var mailOptions = {
                                from: info[4],
                                to: info.parentGmail,
                                subject: `${req.body.subject}`,
                                text: '',
                                html: `<p>
                                    ${req.body.message}
                                    </p>`

                            }
                            transporter.sendMail(mailOptions, (err, result) => {
                                if (err) {
                                    res.send({ message: 'email not sentSuccesfully', status: false })
                                } else {
                                    res.send({ message: 'email sent succesfully', status: true, })

                                }
                            })
                        })
                    } else {
                        res.send({ message: "no gmail to send to", status: false })
                    }

                } else {
                    res.send({ message: "no student to send gmail to", status: false })
                }
            }
        })

    }

}

const sendListToParent = (req, res) => {
    let description = ""
    let amount = ""
    let parentGmails = ""
    let status = false
    let term = ""
    let studentWithParentGmail = []

    // var transporter = nodemailer.createTransport({
    //     service: 'gmail',
    //     auth: {
    //         user: 'skuledman@gmail.com',
    //         pass: process.env.appPass,
    //     }
    // })
    setSchemaModel.findOne({ _id: req.body.setId }, (err, result) => {
        if (err) {
            res.send({ message: "an error occured", status: false })
        } else {
            if (result !== null) {
                schoolModel.findOne({ _id: result.schoolId }, (err, schoolFound) => {
                    if (err) {
                        res.send({ message: "an error occured", status: false })
                        console.log(err)
                    } else {
                        if (req.body.term === "firstTerm") {
                            term = "FirstTerm"
                            result.firstTerm["otherFee"].map((info, id) => {
                                description += info.description + "<br>"
                                amount += info.amount + "<br>"

                            })

                        } else if (req.body.term === "secondTerm") {
                            term = "Second Term"
                            result.secondTerm["otherFee"].map((info, id) => {
                                description += info.description + "<br>"
                                amount += info.amount + "<br>"
                            })
                        } else if (req.body.term === "thirdTerm") {
                            term = "Third Term"
                            result.thirdTerm["otherFee"].map((info, id) => {
                                description += info.description + "<br>"
                                amount += info.amount + "<br>"
                            })
                        }
                        const jss1GmailList = () => {
                            if (result.class === "Jss1") {
                                return new Promise((resolve, reject) => {
                                    studentModel.find({ jss1Id: req.body.setId }, (err, student) => {
                                        if (err) {
                                            status = true
                                        } else {
                                            if (student.length > 0) {

                                                studentWithParentGmail = student.filter((info, id) => info.parentGmail !== "")

                                                if (studentWithParentGmail.length > 0) {
                                                    studentWithParentGmail.map((gmail) => {

                                                        parentGmails += gmail.parentGmail + ","
                                                    })

                                                } else {
                                                    status = false
                                                }
                                            }

                                            const error = false
                                            if (!error) {
                                                resolve()
                                            } else {
                                                reject("an error occured")
                                            }
                                        }
                                    })


                                })

                            }
                        }
                        const jss2GmailList = () => {
                            if (result.class === "Jss2") {
                                return new Promise((resolve, reject) => {
                                    studentModel.find({ jss2Id: req.body.setId }, (err, student) => {
                                        if (err) {
                                            status = true
                                        } else {
                                            if (student.length > 0) {

                                                let studentWithParentGmail = student.filter((info, id) => info.parentGmail !== "")

                                                if (studentWithParentGmail.length > 0) {
                                                    status = true
                                                    studentWithParentGmail.map((gmail, id) => {

                                                        parentGmails += gmail.parentGmail + ","
                                                    })

                                                } else {
                                                    status = false
                                                }

                                            }

                                            const error = false
                                            if (!error) {
                                                resolve()
                                            } else {
                                                reject("an error occured")
                                            }

                                        }
                                    })

                                })


                            }
                        }
                        const jss3GmailList = () => {
                            if (result.class === "Jss3") {
                                return new Promise((resolve, reject) => {
                                    studentModel.find({ jss3Id: req.body.setId }, (err, student) => {
                                        if (err) {
                                            status = true
                                        } else {
                                            if (student.length > 0) {
                                                let studentWithParentGmail = student.filter((info, id) => info.parentGmail !== "")
                                                if (studentWithParentGmail.length > 0) {
                                                    status = true
                                                    studentWithParentGmail.map((gmail, id) => {

                                                        parentGmails += gmail.parentGmail + ","
                                                    })

                                                } else {
                                                    status = false
                                                }
                                            }
                                        }
                                    })

                                    const error = false
                                    if (!error) {
                                        resolve()
                                    } else {
                                        reject("an error occured")
                                    }

                                })


                            }
                        }
                        const sss1GmailList = () => {
                            if (result.class === "Sss1") {
                                return new Promise((resolve, reject) => {
                                    studentModel.find({ sss1Id: req.body.setId }, (err, student) => {
                                        if (err) {
                                            status = true
                                        } else {
                                            if (student.length > 0) {

                                                let studentWithParentGmail = student.filter((info, id) => info.parentGmail !== "")

                                                if (studentWithParentGmail.length > 0) {
                                                    status = true
                                                    studentWithParentGmail.map((gmail, id) => {

                                                        parentGmails += gmail.parentGmail + ","
                                                    })

                                                } else {
                                                    status = false
                                                }
                                            }
                                            const error = false
                                            if (!error) {
                                                resolve()
                                            } else {
                                                reject("an error occured")
                                            }
                                        }
                                    })



                                })


                            }
                        }
                        const sss2GmailList = () => {
                            if (result.class === "Sss1") {
                                return new Promise((resolve, reject) => {
                                    studentModel.find({ sss2Id: req.body.setId }, (err, student) => {
                                        if (err) {
                                            status = true
                                        } else {
                                            if (student.length > 0) {

                                                let studentWithParentGmail = student.filter((info, id) => info.parentGmail !== "")

                                                if (studentWithParentGmail.length > 0) {
                                                    status = true
                                                    studentWithParentGmail.map((gmail, id) => {

                                                        parentGmails += gmail.parentGmail + ","
                                                    })

                                                } else {
                                                    status = false
                                                }
                                            }

                                            const error = false
                                            if (!error) {
                                                resolve()
                                            } else {
                                                reject("an error occured")
                                            }
                                        }
                                    })



                                })


                            }
                        }
                        const sss3GmailList = () => {
                            if (result.class === "Sss1") {
                                return new Promise((resolve, reject) => {
                                    studentModel.find({ sss3Id: req.body.setId }, (err, student) => {
                                        if (err) {
                                            status = true
                                        } else {
                                            if (student.length > 0) {

                                                let studentWithParentGmail = student.filter((info, id) => info.parentGmail !== "")

                                                if (studentWithParentGmail.length > 0) {
                                                    status = true
                                                    studentWithParentGmail.map((gmail, id) => {

                                                        parentGmails += gmail.parentGmail
                                                    })

                                                } else {
                                                    status = false
                                                }
                                            }

                                            const error = false
                                            if (!error) {
                                                resolve()
                                            } else {
                                                reject("an error occured")
                                            }
                                        }
                                    })


                                })


                            }
                        }


                        const sendMailToParent = async () => {
                            await jss1GmailList()
                            await jss2GmailList()
                            await jss3GmailList()
                            await sss1GmailList()
                            await sss2GmailList()
                            await sss3GmailList()

                            if (status) {
                                res.send({ message: "an error occured", status: false })
                            } else {
                                console.log(parentGmails)
                                var transporter = nodemailer.createTransport({
                                    service: 'gmail',
                                    auth: {
                                        user: 'skuledman@gmail.com',
                                        pass: process.env.appPass,
                                    }
                                })

                                var mailOptions = {
                                    from: "skuledman@gmail.com",
                                    to: parentGmails,
                                    subject: schoolFound.schoolName + "" + result.set + "" + term,
                                    text: '',
                                    html:
                                        `
                                        <div style="display:flex;background:#fafafa; width:80%;margin:0 auto;">
                                        <p>${description}</p>
                                        <p>${amount}</p>
                                        </div>
                                        `

                                }
                                transporter.sendMail(mailOptions, (err, result) => {
                                    if (err) {
                                        console.log(err)
                                        res.send({ message: 'email not sentSuccesfully', status: false })
                                    } else {
                                        res.send({ message: 'email sent succesfully', status: true, })

                                    }
                                })

                            }
                        }
                        sendMailToParent()

                    }
                })
            }

        }

    })
}

const addGrade = () => {
    setSchemaModel.findById({ _id: req.body.setId }, (err, result) => {
        if (err) {
            res.send({ message: "an error occured", status: false })
        } else {
            if (result !== null) {
                if (req.body.term === "firstTerm") {
                    result.firstTerm.gradeSetting = req.body.grade
                } else if (req.body.term === "secondTerm") {
                    result.secondTerm.gradeSetting = req.body.grade
                } else if (req.body.term === "thirdTerm") {
                    result.thirdTerm.gradeSetting = req.body.grade
                }

                setSchemaModel.findByIdAndUpdate({ _id: req.body.setId }, (err) => {
                    if (err) {
                        res.send({ message: "an error occured", status: false })
                    } else {
                        res.send({ meesage: "updated succesfully", status: true })
                    }
                })
            }
        }
    })

}
const addsubjectToSet = (req, res) => {
    console.log(req.body)
    setSchemaModel.findOne({ _id: req.body.setId }, (err, result) => {
        if (err) {
            res.send({ message: "an error occured", status: false })
        } else {
            if (result !== null) {
                if (req.body.term === "firstTerm") {
                    if (req.body.classType === 1) {
                        result.firstTerm.scienceSubject = req.body.subjectToBeAdded
                        result.firstTerm.scienceChanges = Number(result.firstTerm.scienceChanges) + 1
                    } else if (req.body.classType === 2) {
                        result.firstTerm.artSubject = req.body.subjectToBeAdded
                        result.firstTerm.artChanges = Number(result.firstTerm.artChanges) + 1
                    } else if (req.body.classType === 3) {
                        result.firstTerm.commercialSubject = req.body.subjectToBeAdded
                        result.firstTerm.commercialChanges = Number(result.firstTerm.commercialChanges) + 1
                    } else {
                        result.firstTerm.juniorSubject = req.body.subjectToBeAdded
                        result.firstTerm.juniorSubjectChanges = Number(result.firstTerm.juniorSubjectChanges) + 1
                    }

                } else if (req.body.term === "secondTerm") {
                    if (req.body.classType === 1) {
                        result.secondTerm.scienceSubject = req.body.subjectToBeAdded
                        result.secondTerm.scienceChanges = Number(result.secondTerm.scienceChanges) + 1
                    } else if (req.body.classType === 2) {
                        result.sesecondTerm.artSubject = req.body.subjectToBeAdded
                        result.secondTerm.artChanges = Number(result.secondTerm.artChanges) + 1
                    } else if (req.body.classType === 3) {
                        result.secondTerm.commercialSubject = req.body.subjectToBeAdded
                        result.secondTerm.commercialChanges = Number(result.secondTerm.commercialChanges) + 1
                    } else {
                        result.secondTerm.juniorSubject = req.body.subjectToBeAdded
                        result.secondTerm.juniorSubjectChanges = Number(result.secondTerm.juniorSubjectChanges) + 1
                    }

                } else if (req.body.term === "thirdTerm") {
                    if (req.body.classType === 1) {
                        result.thirdTerm.scienceSubject = req.body.subjectToBeAdded
                        result.thirdTerm.scienceChanges = Number(result.thirdTerm.scienceChanges) + 1
                    } else if (req.body.classType === 2) {
                        result.thirdTerm.artSubject = req.body.subjectToBeAdded
                        result.thirdTerm.artChanges = Number(result.thirdTerm.artChanges) + 1
                    } else if (req.body.classType === 3) {
                        result.thirdTerm.commercialSubject = req.body.subjectToBeAdded
                        result.thirdTerm.commercialChanges = Number(result.thirdTerm.commercialChanges) + 1
                    } else {
                        result.thirdTerm.juniorSubject = req.body.subjectToBeAdded
                        result.thirdTerm.juniorSubjectChanges = Number(result.thirdTerm.juniorSubjectChanges) + 1
                    }
                }
                console.log(result)
                setSchemaModel.findByIdAndUpdate({ _id: req.body.setId }, result, (err) => {
                    if (err) {
                        res.send({ message: "an error occured", status: false })
                    } else {
                        res.send({ message: "updatedSuccesfully", status: true })
                    }

                })
            }
        }

    })
}
module.exports = {
    saveSet,
    getSet,
    getCurrentSet,
    deleteSet,
    updatePTAFeeAndSchoolFees,
    createFeeList,
    delPriceList,
    editPriceList,
    sendMail,
    sendListToParent,
    addGrade,
    addsubjectToSet

}