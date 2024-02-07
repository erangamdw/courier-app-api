import * as mongoose from "mongoose";
import {Schema} from "mongoose";
import {ICategory} from "../models/category-model";


const schemaOptions: mongoose.SchemaOptions = {
    _id: true,
    id: false,
    timestamps: true,
    skipVersioning: true,
    strict: false,
    toJSON: {
        getters: true,
        virtuals: true,
    },
};

export const categorySchema = new mongoose.Schema({
    category: {
        type: Schema.Types.String,
        required: true
    },
    note: {
      type:Schema.Types.String,
      required: false
    },
    isValid: {
        type: Schema.Types.Boolean,
        required: false,
        default: true
    },
    usage: {
        type: Schema.Types.Number,
        required: false,
    }
}, schemaOptions);


const Category = mongoose.model<ICategory>('Category', categorySchema);
export default Category;
