const mongoose = require("mongoose")
const setSchemaModel = require("../Models/set")
const studentModel = require("../Models/Student")

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
    const currentSetId = req.headers.authorization.split(" ")[1]
    setSchemaModel.findOne({ _id: currentSetId }, (err, resultFound) => {
        if (err) {
            res.send({ message: "can't find set", status: false })
        } else {
            if (resultFound.class === "Jss1") {
                studentModel.find({ jss1Id: resultFound._id }, (err, result) => {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log(result)
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
                                studentTotalFirstTermPaid += student.jss1.firstTermSchoolFees
                            })
                        }
                        if (secondTermStudent.length > 0) {
                            secondTermStudent.map((student, id) => {
                                studentTotalSecondTermPaid += student.jss1.secondTermSchoolFees
                            })
                        }
                        if (thirdTermStudent.length > 0) {
                            thirdTermStudent.map((student, id) => {
                                studentTotalthirTermPaid += student.jss1.secondTermSchoolFees
                            })
                        }


                    }
                })
            } else if (resultFound.class === "Jss2") {
                studentModel.find({ jss2Id: result._id }, (err, result) => {
                    if (err) {
                        console.log(err)
                    } else {
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
                            firstTermStudent.map((student, id) => {
                                studentTotalFirstTermPaid += student.jss2.firstTermSchoolFees
                            })
                        }
                        if (secondTermStudent.length > 0) {
                            secondTermStudent.map((student, id) => {
                                studentTotalSecondTermPaid += student.jss2.secondTermSchoolFees
                            })
                        }
                        if (thirdTermStudent.length > 0) {
                            thirdTermStudent.map((student, id) => {
                                studentTotalthirTermPaid += student.jss2.secondTermSchoolFees
                            })
                        }

                    }
                })

            } else if (resultFound.class === "Jss3") {
                studentModel.find({ jss3Id: resultFound._id }, (err, result) => {
                    if (err) {
                        console.log(err)
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
                                studentTotalFirstTermPaid += student.jss3.firstTermSchoolFees
                            })
                        }
                        if (secondTermStudent.length > 0) {
                            secondTermStudent.map((student, id) => {
                                studentTotalSecondTermPaid += student.jss3.secondTermSchoolFees
                            })
                        }
                        if (thirdTermStudent.length > 0) {
                            thirdTermStudent.map((student, id) => {
                                studentTotalthirTermPaid += student.jss3.secondTermSchoolFees
                            })
                        }
                    }
                })


            } else if (resultFound.class === "Sss1") {
                studentModel.find({ sss1Id: resultFound._id }, (err, result) => {
                    if (err) {
                        console.log(err)
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
                                studentTotalFirstTermPaid += student.sss1.firstTermSchoolFees
                            })
                        }
                        if (secondTermStudent.length > 0) {
                            secondTermStudent.map((student, id) => {
                                studentTotalSecondTermPaid += student.sss1.secondTermSchoolFees
                            })
                        }
                        if (thirdTermStudent.length > 0) {
                            thirdTermStudent.map((student, id) => {
                                studentTotalthirTermPaid += student.sss1.secondTermSchoolFees
                            })
                        }
                    }

                })


            } else if (resultFound.class === "Sss2") {
                studentModel.find({ sss2Id: resultFound._id }, (err, result) => {
                    if (err) {
                        console.log(err)
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
                    }
                    if (firstTermStudent.length > 0) {
                        firstTermStudent.map((student, id) => {
                            studentTotalFirstTermPaid += student.sss2.firstTermSchoolFees
                        })
                    }
                    if (secondTermStudent.length > 0) {
                        secondTermStudent.map((student, id) => {
                            studentTotalSecondTermPaid += student.sss2.secondTermSchoolFees
                        })
                    }
                    if (thirdTermStudent.length > 0) {
                        thirdTermStudent.map((student, id) => {
                            studentTotalthirTermPaid += student.sss2.secondTermSchoolFees
                        })
                    }
                })

            } else if (resultFound.class === "Sss3") {
                studentModel.find({ sss3Id: resultFound._id }, (err, result) => {
                    if (err) {
                        console.log(err)
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
                    }
                    if (firstTermStudent.length > 0) {
                        firstTermStudent.map((student, id) => {
                            studentTotalFirstTermPaid += student.sss3.firstTermSchoolFees
                        })
                    }
                    if (secondTermStudent.length > 0) {
                        secondTermStudent.map((student, id) => {
                            studentTotalSecondTermPaid += student.sss3.secondTermSchoolFees
                        })
                    }
                    if (thirdTermStudent.length > 0) {
                        thirdTermStudent.map((student, id) => {
                            studentTotalthirTermPaid += student.sss3.secondTermSchoolFees
                        })
                    }

                })

            }
            const debtOwnedFirstTermSchoolFees = totalSchoolFeesForFirstTerm - studentTotalFirstTermPaid
            const debtOwnedSecondTermSchoolFees = totalSchoolFeesForSecondTerm - studentTotalSecondTermPaid
            const debtOwnedThirdTermSchoolFees = totalSchoolFeesForThirdTerm - studentTotalthirTermPaid

            res.send({ currentSet: resultFound, status: true })
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



            } else if (req.body.term === "thirdTerm") {

                if (req.body.schoolFees === "") {
                    result.thirdTerm["ptaFees"] = req.body.ptaFees
                } else if (req.body.ptaFees === "") {
                    result.thirdTerm["schoolFees"] = req.body.schoolFees
                } else {
                    result.thirdTerm["ptaFees"] = req.body.ptaFees
                    result.thirdTerm["schoolFees"] = req.body.schoolFees
                }


            }
            setSchemaModel.findOneAndUpdate({ _id: req.body.setId }, result, (err) => {
                if (err) {
                    res.send({ message: "unable to update", status: false })
                } else {
                    res.send({ message: "updated succesfully", status: true })
                }
            })
        }
    })

}


///Creation of list 
const createFeeList = (req, res) => {

    setSchemaModel.findOne({ _id: req.body.setInfo["setid"] }, (err, result) => {
        if (err) {
            console.log(err)
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
module.exports = {
    saveSet,
    getSet,
    getCurrentSet,
    updatePTAFeeAndSchoolFees,
    createFeeList,
    delPriceList
}