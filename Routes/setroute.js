const express = require("express")
const route = express.Router()
const { saveSet, getSet } = require("../Controllers/Set")

route.post("/newset", saveSet)
route.get("/getset", getSet)

















module.exports = route