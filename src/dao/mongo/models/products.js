import mongoose, { mongo } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

// 1. Creating collection
const collection = "products";

// 2. Creating schema
const schema = new mongoose.Schema({

    title:{
        type:String,
        required:true
    },

    description:{
        type:String,
        required:true
    },

    price:{
        type:Number,
        required:true
    },

    thumbnail:{
        type:Array,
        default:[]
    },

    stock:{
        type:Number,
        required:true
    },

    code:{
        type:String,
        required:true
    },

    category:{
        type:String,
        required:true
    },

    status:{
        type:Boolean,
        default:true
    }
}, {timestamps:true});

// Adding pagination
schema.plugin(mongoosePaginate);

// 3. Creating model
const productsModel = mongoose.model(collection, schema);

export default productsModel;