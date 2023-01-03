const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const schoolSchema = mongoose.Schema({
    schoolEmail: { type: String, required: true, unique: true },
    schoolName: { type: String, required: true },
    schoolImgUrl: { type: String },
    schoolAddress: { type: String, required: true },
    schoolPhoneNumber: { type: String, required: true },
    schoolPassword: { type: String, required: true },
    otp: { type: String },
    otpStatus: { type: Boolean }

})
const hashedTime = 6
schoolSchema.pre("save", function (next) {
    console.log(this.schoolPassword)
    this.otp = bcrypt.hash(this.otp, hashedTime)
    bcrypt.hash(this.schoolPassword, hashedTime, (err, result) => {
        if (err) {
            console.log("an err occured when hashing")
        } else {
            this.schoolPassword = result
            next()
        }

    })


})
schoolSchema.methods.validatePassword = function (password, callback) {
    bcrypt.compare(password, this.schoolPassword, (err, same) => {
        callback(err, same)
    })
}

const schoolModel = mongoose.model("schoolsReg", schoolSchema)




module.exports = schoolModel