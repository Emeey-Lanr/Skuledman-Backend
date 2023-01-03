const express = require("express")
const route = express.Router()
const { saveSet,
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
} = require("../Controllers/Set")

route.post("/newset", saveSet)
route.get("/getset", getSet)
route.get("/currentSet", getCurrentSet)
route.patch("/deleteset", deleteSet)
route.patch("/updateFees", updatePTAFeeAndSchoolFees)
route.patch("/createList", createFeeList)
route.patch("/deletePriceList", delPriceList)
route.patch("/editFeeList", editPriceList)
route.post("/sendmail", sendMail)
route.post("/sendlist", sendListToParent)
route.patch("/addgrade", addGrade)
route.post("/addSubjectToSet", addsubjectToSet)

















module.exports = route