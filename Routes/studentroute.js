const express = require("express")
const route = express.Router()
const {
    registerStudent,
    searchStudentBelowSet,
    addStudentToNewSet
} = require("../Controllers/studentContoller")

route.post("/registerStudent", registerStudent)
route.get("/searchStudentToAdd", searchStudentBelowSet)
route.patch("/addStudentToNewSet", addStudentToNewSet)


















module.exports = route