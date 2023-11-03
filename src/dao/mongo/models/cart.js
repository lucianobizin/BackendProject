import mongoose, { mongo } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

// 1. Creating collection
const collection = "carts";

const productSchema = new mongoose.Schema({
    pid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
}, { _id: false });

// 2. Creating schema
const schema = new mongoose.Schema({

    products: [productSchema],

}, { timestamps: true });

schema.pre(["find", "findOne"], function () {
    this.populate("products.pid")
})

// Adding pagination
schema.plugin(mongoosePaginate);

// 3. Creating model
const cartModel = mongoose.model(collection, schema);

export default cartModel