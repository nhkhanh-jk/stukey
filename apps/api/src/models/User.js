const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            require: true,
        },
        email: {
            type: String,
            require: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        phone: {
            type: String,
            default: "",
            trim: true,
        },
        address: {
            type: String, 
            default:"",
            trim: true,
        },
        role: {
            type: String,
            enum: ["admin", "teacher", "student"],
            default: "student",
        },
        passwordHash: {
            type: String,
            require: true,
        },
    },
    {
        timestamps: true,
    }
);

// check password
userSchema.methods.matchPassword = async function (entenredPassword) {
    return bcrypt.compare(entenredPassword, this.passwordHash);
}

userSchema.pre("save", async function (next) {
   if(!this.isModified("passwordHash")){
    return;
   }
});

const User = mongoose.model("User", userSchema);
module.exports = User;

    