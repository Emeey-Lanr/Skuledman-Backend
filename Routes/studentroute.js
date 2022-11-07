const express = require("express")
const route = express.Router()
const {
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
    deletingValuePoint
} = require("../Controllers/studentContoller")

route.post("/registerStudent", registerStudent)
route.get("/searchStudentToAdd", searchStudentBelowSet)
route.patch("/addStudentToNewSet", addStudentToNewSet)
route.get("/getStudent", getStudent)
route.get("/currentStudent", gettingTheCurrentStudent)
route.patch("/uploadimg", uploadStudentImg)
route.patch("/savechanges", saveChanges)
route.patch("/activateStatus", activateStatus)
route.patch("/addschoolfee", addSchoolFee)
route.patch("/addptafee", addPtaFee)
route.patch("/addSubject", addSubject)
route.patch("/addvaluetosubject", addValue)
route.patch("/deletesubject", deleteSubject)
route.patch("/deleteValuePoint", deletingValuePoint)



















module.exports = route