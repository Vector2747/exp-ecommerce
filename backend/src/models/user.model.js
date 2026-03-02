import mongoose from "mongoose";

const addresseSchema = new mongoose.Schema({
    label : {
        type : String,
        required : true,
    },
    fullName : {
        type : String,
        required : true,
    },
    streetAdress : {
        type : String,
        required : true,
    },
    city : {
        type : String,
        required : true,
    },
    state : {
        type : String,
        required : true,
    },
    ZIPcode : {
        type : String,
        required : true,
    },
    PhoneNumber : {
        type : String,
        required : true,
    },
    isDefault : {
        type : Boolean,
        default : false,
    },
})

const userShema = new mongoose.Schema({
    email:{
        type : String,
        required : true,
        unique : true
    },
    name:{
        type : String,
        required : true,
    },
    imageURL:{
        type : String,
        default : ""
    },
    clerkId:{
        type : String,
        unique : true,
        required : true
    },
    addresses : [addresseSchema],
    wishlist : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Product"
        }
    ]
}, {timestamps : true})

export const User = mongoose.model("User", userShema)