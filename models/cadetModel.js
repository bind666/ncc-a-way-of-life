import mongoose from "mongoose";
import createError from "http-errors";
import bcrypt from 'bcrypt'

const CadetSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true

    },
    rank: {
        type: String,
        required: true

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
    regNo: {
        type: String,
        unique: true,
        // required: true

    },
    unit: {
        type: String,
        required: true
        //branch
    },
    progress: {
        type: Array,
        default: []
        //certification
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userModel",
        required: true
    },
    refreshToken:{
        type:String,
        default:null
    },
    accessToken:{
        type:String,
        default:null
    },

}, { timestamps: true });

CadetSchema.pre("save", async function (next) {
    try {
        if (!this.isModified("password")) next()
        const salt = await bcrypt.genSalt(10); //it generate a salt (big string)
        this.password = await bcrypt.hash(this.password, salt)
        next();
    } catch (error) {
        next(createError(500, error.message))
    }
})

export default mongoose.model("Cadet", CadetSchema);
