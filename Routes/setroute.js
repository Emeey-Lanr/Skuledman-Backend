const express = require("express")
const route = express.Router()
const { saveSet,
    getSet,
    getCurrentSet,
    deleteSet,
    updatePTAFeeAndSchoolFees,
    createFeeList,
    delPriceList
} = require("../Controllers/Set")

route.post("/newset", saveSet)
route.get("/getset", getSet)
route.get("/currentSet", getCurrentSet)
route.patch("/deleteset", deleteSet)
route.patch("/updateFees", updatePTAFeeAndSchoolFees)
route.patch("/createList", createFeeList)
route.patch("/deletePriceList", delPriceList)

















module.exports = route