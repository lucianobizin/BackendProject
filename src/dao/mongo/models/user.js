import mongoose from "mongoose";
// import mongoosePaginate from "mongoose-paginate-v2";

const collection = "Users";

const schema = new mongoose.Schema(
    
    {

    firstName: {
        type: String,
        required: true
    },

    lastName: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        index: true,
        unique: true
    },

    birthDate: {
        type:Date,
        required: true
    },

    userName: {
        type:String,
        index: true,
        required: true,
        unique: true
    },

    password: {
        type:String,
        required: true
    },

    role:{
        type:String,
        enum:['user',"premium", 'admin'],
        default: "user"
    },

    cart:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "cart",
    }


}, {timestamps: true});

// Adding pagination
// schema.plugin(mongoosePaginate);

const usersModel = mongoose.model(collection, schema);

export default usersModel;