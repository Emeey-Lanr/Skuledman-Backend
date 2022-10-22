const mongoose = require("mongoose")
const setSchemaModel = require("../Models/set")

let check = false
let schoolid = ""
const saveSet = (req, res) => {
    console.log(req.body.class, req.body.set)
    let setForm = new setSchemaModel(req.body)

    setSchemaModel.find({ schoolId: req.body.schoolId }, (err, result) => {
        if (err) {
            consoel.log(err)
        } else {
            let Class = result.filter((sets, id) => sets.class === req.body.class)
            Class.map((sets, id) => {
                if (sets.set === req.body.set) {
                    check = true
                }
            })

        }

        if (check) {
            res.send({ message: "A set alraedy exist with this set year", status: false })
            console.log("user already exist")
        } else {
            setForm.save((err) => {
                if (err) {
                    console.log(err)
                    res.send({ message: "unable to create", status: false })
                } else {
                    res.send({ message: "set saved succesfully", status: true })
                    schoolid = req.body.schoolId
                }
            })
        }
    })

}


const getSet = (req, res) => {
    let schoolId = req.headers.authorization.split(" ")[1]
    setSchemaModel.find({ schoolId: schoolId }, (err, result) => {
        if (err) {
            console.log('unabale to find set')
            res.send({ status: false })
        } else {
            console.log(result)
            const jss1 = result.filter((sets, id) => sets.class === "Jss1")
            const jss2 = result.filter((sets, id) => sets.class === "Jss2")
            const jss3 = result.filter((sets, id) => sets.class === "Jss3")
            const ss1 = result.filter((sets, id) => sets.class === "Sss1")
            const ss2 = result.filter((sets, id) => sets.class === "Sss2")
            const ss3 = result.filter((sets, id) => sets.class === "Sss3")
            res.send({ status: true, set1: jss1, set2: jss2, set3: jss3, set4: ss1, set5: ss2, set6: ss3 })
        }

    })
}

module.exports = {
    saveSet,
    getSet,
}