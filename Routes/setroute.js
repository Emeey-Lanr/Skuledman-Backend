const express = require("express")
const route = express.Router()
const { saveSet,
    getSet,
    getCurrentSet,
    updatePTAFeeAndSchoolFees,
    createFeeList
} = require("../Controllers/Set")

route.post("/newset", saveSet)
route.get("/getset", getSet)
route.get("/currentSet", getCurrentSet)
route.patch("/updateFees", updatePTAFeeAndSchoolFees)
route.patch("/createList", createFeeList)

















module.exports = route