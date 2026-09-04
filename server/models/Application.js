const { Schema } = require("mongoose");
const mongoose = require("mongoose");


const AppSchema = new Schema ({
        
        userId: {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,

        },
        company:{
            type:String,
            required:true,
        },
        role:{
            type:String,
            required:true,
        },
        status: {
    type: String,
    enum: ["applied", "oa", "interview", "offer", "rejected"],
    default: "applied",
    required: true,
},
appliedDate:{
    type:Date,
},
jobLink:{
    type:String,
},
notes:{
    type:String,
},



},{ timestamps: true });

module.exports = mongoose.model("Application", AppSchema)