const express = require("express")
const route = express.Router()
const {
    registerStudent,
    searchStudentBelowSet,
    addStudentToNewSet,
    getStudent,
    gettingTheCurrentStudent,
    activateStatus
} = require("../Controllers/studentContoller")

route.post("/registerStudent", registerStudent)
route.get("/searchStudentToAdd", searchStudentBelowSet)
route.patch("/addStudentToNewSet", addStudentToNewSet)
route.get("/getStudent", getStudent)
route.get("/currentStudent", gettingTheCurrentStudent)
route.patch("/activateStatus", activateStatus)



















module.exports = route