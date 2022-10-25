const { format } = require("express/lib/response")
const mongoose = require("mongoose")
const setSchemaModel = require("../Models/set")
const studentModel = require("../Models/Student")

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
                        console.log(result)
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


const addStudentToNewSet = (req, res) => {
    studentModel.findOne({ _id: req.body.studentId }, (err, result) => {
        if (err) {
            res.send({ message: "an error occured", status: false })
        } else {
            result.currentClass = req.body.currentClass
            if (req.body.currentClass === "Jss1") {
                result.jss1.set = req.body.set
                result.jss1.setId = req.body.setId
            } else if (req.body.currentClass === "Jss2") {
                result.jss2.set = req.body.set
                result.jss2.setId = req.body.setId
            } else if (req.body.currentClass === "Jss3") {
                result.jss3.set = req.body.set
                result.jss3.setId = req.body.setId
            } else if (req.body.currentClass === "Sss1") {
                result.sss1.set = req.body.set
                result.sss1.setId = req.body.setId
            } else if (req.body.currentClass === "Sss2") {
                result.sss2.set = req.body.set
                result.sss2.setId = req.body.setId

            } else if (req.body.currentClass === "Sss3") {
                result.sss3.set = req.body.set
                result.sss3.setId = req.body.setId
            }
            studentModel.findOneAndUpdate({ _id: req.body.studentId }, result, (err) => {
                if (err) {
                    res.send({ message: "an error ocurred", status: false })
                } else {
                    res.send({ message: "added succesfully", status: true })
                    console.log("added succesfully")
                }
            })
        }
    })
}








module.exports = {
    registerStudent,
    searchStudentBelowSet,
    addStudentToNewSet,


}