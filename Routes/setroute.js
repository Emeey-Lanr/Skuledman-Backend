const express = require("express")
const route = express.Router()
const { saveSet,
    getSet,
    getCurrentSet,
    updatePTAFeeAndSchoolFees } = require("../Controllers/Set")

route.post("/newset", saveSet)
route.get("/getset", getSet)
route.get("/currentSet", getCurrentSet)
route.patch("/updateFees", updatePTAFeeAndSchoolFees)

















module.exports = route