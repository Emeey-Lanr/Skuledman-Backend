const mongoose = require("mongoose")
const setSchemaModel = require("../Models/set")
const studentModel = require("../Models/Student")
const schoolModel = require("../Models/schoolModel")
const nodemailer = require("nodemailer")
const res = require("express/lib/response")

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


    const currentSetId = req.headers.authorization.split(" ")[1]
    setSchemaModel.findOne({ _id: currentSetId }, (err, resultFound) => {
        if (err) {
            res.send({ message: "can't find set", status: false })
        } else {
            if (resultFound.class === "Jss1") {
                studentModel.find({ jss1Id: resultFound._id }, (err, result) => {
                    if (err) {
                        res.send({ status: false, message: "an error occured" })
                    } else {
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
                        const debtOwnedFirstTermSchoolFees = Number(totalSchoolFeesForFirstTerm) - Number(studentTotalFirstTermPaid)
                        const debtOwnedSecondTermSchoolFees = Number(totalSchoolFeesForSecondTerm) - Number(studentTotalSecondTermPaid)
                        const debtOwnedThirdTermSchoolFees = Number(totalSchoolFeesForThirdTerm) - Number(studentTotalthirTermPaid)
                        ////Pta
                        const debtOwnedFirstTermPtaFees = Number(totalPtaFeesForFirstTerm) - Number(studentTotalFirstPtaFeePaid)
                        const debtOwnedSecondTermPtaFees = Number(totalPtaFeesForSecondTerm) - Number(studentTotalSecondPtaFeePaid)
                        const debtOwnedThirdTermPtaFees = Number(totalPtaFeesForThirdTerm) - Number(studentTotalThirdPtaFeePaid)

                        res.send({
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
                })
            } else if (resultFound.class === "Jss2") {
                studentModel.find({ jss2Id: resultFound._id }, (err, result) => {
                    if (err) {
                        res.send({ status: false, message: "an error occured" })
                    } else {
                        if (result !== null) {
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
                            const debtOwnedFirstTermSchoolFees = totalSchoolFeesForFirstTerm - studentTotalFirstTermPaid
                            const debtOwnedSecondTermSchoolFees = totalSchoolFeesForSecondTerm - studentTotalSecondTermPaid
                            const debtOwnedThirdTermSchoolFees = totalSchoolFeesForThirdTerm - studentTotalthirTermPaid
                            ////Pta
                            const debtOwnedFirstTermPtaFees = totalPtaFeesForFirstTerm - studentTotalFirstPtaFeePaid
                            const debtOwnedSecondTermPtaFees = totalPtaFeesForSecondTerm - studentTotalSecondPtaFeePaid
                            const debtOwnedThirdTermPtaFees = totalPtaFeesForThirdTerm - studentTotalThirdPtaFeePaid
                            res.send({
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

                    }
                })

            } else if (resultFound.class === "Jss3") {
                studentModel.find({ jss3Id: resultFound._id }, (err, result) => {
                    if (err) {
                        res.send({ status: false, message: "an error occured" })
                    } else {
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
                        const debtOwnedFirstTermSchoolFees = totalSchoolFeesForFirstTerm - studentTotalFirstTermPaid
                        const debtOwnedSecondTermSchoolFees = totalSchoolFeesForSecondTerm - studentTotalSecondTermPaid
                        const debtOwnedThirdTermSchoolFees = totalSchoolFeesForThirdTerm - studentTotalthirTermPaid
                        ////Pta
                        const debtOwnedFirstTermPtaFees = totalPtaFeesForFirstTerm - studentTotalFirstPtaFeePaid
                        const debtOwnedSecondTermPtaFees = totalPtaFeesForSecondTerm - studentTotalSecondPtaFeePaid
                        const debtOwnedThirdTermPtaFees = totalPtaFeesForThirdTerm - studentTotalThirdPtaFeePaid
                        res.send({
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
                })


            } else if (resultFound.class === "Sss1") {
                studentModel.find({ sss1Id: resultFound._id }, (err, result) => {
                    if (err) {
                        res.send({ status: false, message: "an error occured" })
                    } else {
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
                        const debtOwnedFirstTermSchoolFees = totalSchoolFeesForFirstTerm - studentTotalFirstTermPaid
                        const debtOwnedSecondTermSchoolFees = totalSchoolFeesForSecondTerm - studentTotalSecondTermPaid
                        const debtOwnedThirdTermSchoolFees = totalSchoolFeesForThirdTerm - studentTotalthirTermPaid
                        ////Pta
                        const debtOwnedFirstTermPtaFees = totalPtaFeesForFirstTerm - studentTotalFirstPtaFeePaid
                        const debtOwnedSecondTermPtaFees = totalPtaFeesForSecondTerm - studentTotalSecondPtaFeePaid
                        const debtOwnedThirdTermPtaFees = totalPtaFeesForThirdTerm - studentTotalThirdPtaFeePaid
                        res.send({
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

                })


            } else if (resultFound.class === "Sss2") {
                studentModel.find({ sss2Id: resultFound._id }, (err, result) => {
                    if (err) {
                        res.send({ status: false, message: "an error occured" })
                    } else {
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
                        const debtOwnedFirstTermSchoolFees = totalSchoolFeesForFirstTerm - studentTotalFirstTermPaid
                        const debtOwnedSecondTermSchoolFees = totalSchoolFeesForSecondTerm - studentTotalSecondTermPaid
                        const debtOwnedThirdTermSchoolFees = totalSchoolFeesForThirdTerm - studentTotalthirTermPaid
                        ////Pta
                        const debtOwnedFirstTermPtaFees = totalPtaFeesForFirstTerm - studentTotalFirstPtaFeePaid
                        const debtOwnedSecondTermPtaFees = totalPtaFeesForSecondTerm - studentTotalSecondPtaFeePaid
                        const debtOwnedThirdTermPtaFees = totalPtaFeesForThirdTerm - studentTotalThirdPtaFeePaid
                        res.send({
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

                })

            } else if (resultFound.class === "Sss3") {
                studentModel.find({ sss3Id: resultFound._id }, (err, result) => {
                    if (err) {
                        res.send({ status: false, message: "an error occured" })
                    } else {
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
                        const debtOwnedFirstTermSchoolFees = totalSchoolFeesForFirstTerm - studentTotalFirstTermPaid
                        const debtOwnedSecondTermSchoolFees = totalSchoolFeesForSecondTerm - studentTotalSecondTermPaid
                        const debtOwnedThirdTermSchoolFees = totalSchoolFeesForThirdTerm - studentTotalthirTermPaid
                        ////Pta
                        const debtOwnedFirstTermPtaFees = totalPtaFeesForFirstTerm - studentTotalFirstPtaFeePaid
                        const debtOwnedSecondTermPtaFees = totalPtaFeesForSecondTerm - studentTotalSecondPtaFeePaid
                        const debtOwnedThirdTermPtaFees = totalPtaFeesForThirdTerm - studentTotalThirdPtaFeePaid
                        res.send({
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


                })

            }




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
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'skuledman@gmail.com',
            pass: process.env.appPass,
        }
    })
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
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'skuledman@gmail.com',
            pass: process.env.appPass,
        }
    })
    setSchemaModel.findOne({ _id: req.body.setId }, (err, result) => {
        if (err) {
            res.send({ message: "an error occured", status: false })
        } else {
            if (result !== null) {
                schoolModel.findOne({ _id: result.schoolId }, (err, schoolFound) => {
                    if (err) {
                        res.send({ message: "an error occured", status: false })
                    } else {
                        if (result.class === "Jss1") {
                            studentModel.find({ jss1Id: req.body.setId }, (err, student) => {
                                if (err) {
                                    res.send({ message: "an error occured", status: false })
                                } else {
                                    if (student.length > 0) {
                                        let studentWithParentGmail = student.filter((info, id) => info.parentGmail !== "")

                                        if (studentWithParentGmail.length > 0) {
                                            if (req.body.term === "firstTerm") {

                                                studentWithParentGmail.map((gmail, id) => {
                                                    result.firstTerm["otherFee"].map((info, id) => {
                                                        console.log(info.description)
                                                        var mailOptions = {
                                                            from: result.schoolEmails,
                                                            to: gmail.parentGmail,
                                                            subject: schoolFound.schoolName + " " + result.set + " " + "List",
                                                            text: '',
                                                            html: `<span><b>${info.description}</b></span>
                                                          <span>--</span>
                                                          <span><b>${info.amount}</b></span>
                                                          <br>`
                                                        }
                                                        transporter.sendMail(mailOptions, (err) => {
                                                            if (err) {
                                                                res.send({ message: 'email not sentSuccesfully', status: false })
                                                            } else {
                                                                res.send({ message: 'email sent succesfully', status: true, })

                                                            }
                                                        })
                                                    })

                                                })

                                            } else if (req.body.term === "secondTerm") {
                                                result.firstTerm["otherFee"].map((info, id) => {

                                                })
                                            } else if (req.body.term === "thirdTerm") {
                                                result.firstTerm["otherFee"].map((info, id) => {

                                                })
                                            }
                                        } else {
                                            res.send({ message: "no gmail to send mail to", status: false })
                                        }
                                    }
                                }
                            })
                        }
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
                        result.secondTerm.juniorSubject = req.body.subjectToBeAdded
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