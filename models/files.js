const mongoose=require("mongoose")
const fileschema=mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users"
        },
        pafile: {
            type: String,
            required: true
        },
        filename: {
            type: String,
            required: true
        },
        postdate: {
            type: Date,
            default: Date.now
        }
    }
)

var fileModel=mongoose.model("files",fileschema)
module.exports=fileModel