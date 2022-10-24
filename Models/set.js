const mongoose = require("mongoose")
const setSchema = mongoose.Schema({
    schoolId: { type: String },
    schoolEmail: { type: String },
    class: { type: String },
    set: { type: String },
    firstTerm: { type: Object },
    secondTerm: { type: Object },
    thirdTerm: { type: Object },
    numberOFStudent: { type: String },
    totalDebt: { type: String },
    totalMoneyPaid: { type: String },
})

const setSchemaModel = mongoose.model("schoolSet", setSchema)



module.exports = setSchemaModel