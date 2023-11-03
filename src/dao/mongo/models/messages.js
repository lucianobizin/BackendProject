import mongoose from "mongoose";

const collection = "Messages";

const schema = new mongoose.Schema({

    room: {
        type:String
    },

    username:{
        type:String
    },

    email: {
        type:String
    },

    body:{
        type:String
    }

}, {timestamps:true});

const messageModel = mongoose.model(collection, schema);

export default messageModel;