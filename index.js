const express = require("express")
const app = express()
const cors = require("cors")
const mongoose = require("mongoose")
require("dotenv").config()

PORT = process.env.PORT
URI = process.env.URI
app.use(express.urlencoded({ extended: true, limit: "500mb" }))
app.use(cors())
app.use(express.json({ limit: "500mb" }))
const adminRoute = require("./Routes/adminRoute")
app.use("/school", adminRoute)


mongoose.connect(URI, (err) => {
    if (err) {
        console.log(err)
    } else {
        console.log("mongoose has connected")
    }
})















app.listen(PORT, () => {
    console.log(`app has started at port ${PORT}`)
})