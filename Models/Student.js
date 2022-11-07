const mongoose = require("mongoose")
const studentSchema = mongoose.Schema({
    firstName: { type: String },
    middleName: { type: String },
    surName: { type: String },
    schoolId: { type: String },
    schoolEmail: { type: String },
    imgUrl: { type: String },
    schoolUniqueId: { type: Number },
    currentClass: { type: String },
    parentGmail: { type: String },
    parentPhoneNumber: { type: String },
    jss1Id: { type: String },
    jss2Id: { type: String },
    jss3Id: { type: String },
    sss1Id: { type: String },
    sss2Id: { type: String },
    sss3Id: { type: String },
    jss1: { type: Object },
    jss2: { type: Object },
    jss3: { type: Object },
    sss1: { type: Object },
    sss2: { type: Object },
    sss3: { type: Object },
})


const studentModel = mongoose.model("/studentCollection", studentSchema)


module.exports = studentModel