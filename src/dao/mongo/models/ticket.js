import mongoose, { mongo } from "mongoose";

const collection = "tickets";

const schema = new mongoose.Schema({

    code:{
        type:String,
        require: true,
        unique: true
    },

    purchase_datetime:{
        type:Date,
        require: true,
        unique: true
    },

    amount:{
        type:Number,
        require: true
    },

    purchaser:{
        type:String,
        require: true
    }

}, {timestamps:true});

const ticketsModel = mongoose.model(collection, schema);

export default ticketsModel;