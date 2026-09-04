const { Schema } = require("mongoose");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");


const userSchema = new Schema(
    {
        username:{
            type: String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            index:true,
        },
        email:{
            type:String,
            required: true,
            trim:true,
            unique:true,
            lowercase:true,
        },
        password:{
            type:String,
            required:[true, "Password is required"],
        },
        refreshToken: {
type: String,
},
forgotPasswordToken: { type: String },
forgotPasswordExpiry: { type: Date },
},
{ timestamps: true }
    
)

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password,10);
    next();
})
userSchema.methods.comparePassword = async function(password)
{
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema)