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
    expirationTime: {
        type: Date,
        expires: '2d',
        default: () => new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) //  después de 48 horas
    },

}, { timestamps: true });

// Creating a TTL Index for expirationTime
schema.index({ expirationTime: 1 }, { expireAfterSeconds: 0 });

schema.pre(["find", "findOne"], function () {
    this.populate("products.pid")
})

// Adding pagination
schema.plugin(mongoosePaginate);

// 3. Creating model
const cartModel = mongoose.model(collection, schema);

export default cartModel