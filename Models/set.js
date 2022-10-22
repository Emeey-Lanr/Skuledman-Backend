const mongoose = require("mongoose")
const setSchema = mongoose.Schema({
    schoolId: { type: String },
    schoolEmail: { type: String },
    class: { type: String },
    set: { type: String },
    firstTerm: { type: Array },
    secondTerm: { type: Array },
    thirdTerm: { type: Array },
    numberOFStudent: { type: String },
    totalDebt: { type: String },
    totalMoneyPaid: { type: String },
})

const setSchemaModel = mongoose.model("jss1Schema", setSchema)



module.exports = setSchemaModel