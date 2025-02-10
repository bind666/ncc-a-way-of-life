import { Schema, model } from "mongoose";
import createError from "http-errors";
import bcrypt from 'bcrypt'

const userSchema = new Schema({
    fullName: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    },
    refreshToken:{
        type:String,
        default:null
    },
    accessToken:{
        type:String,
        default:null
    },
})

userSchema.pre("save", async function (next) {
    try {
        if (!this.isModified("password")) next()
        const salt = await bcrypt.genSalt(10); //it generate a salt (big string)
        this.password = await bcrypt.hash(this.password, salt)
        next();
    } catch (error) {
        next(createError(500, error.message))
    }
})
    

const userModel = model("userModel", userSchema)
export default userModel