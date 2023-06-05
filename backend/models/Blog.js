import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
        min: 4,
    },
    desc: {
        type: String,
        required: true,
        min: 12,
    },
    photo: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    feature: {
        type: Boolean,
        default: false,
    },
    views: {
        type: Number,
        default: false,
    },
    likes: {
        type: [String],
        default: [],
    },
}, {timestamps:true})

export default mongoose.model("Blog", BlogSchema);