import mongoose from 'mongoose'
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2'

const vedioSchema = new mongoose.Schema(
    {
        vedioFile: {
            type: String, // cloudianry url
            required: true
        },
        thumbnail: {
            type: String,
            required: true
        },
        title:{
            type: String,
            required: true,
        },
        description:{
            type: String,
            required: true,
        },
        duration:{
            type: Number,
            required: true
        },
        view:{
            type: Number,
            default: 0
        },
        isPublished: {
            type: Boolean,
            default: true
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true
    }
)

vedioSchema.plugin(mongooseAggregatePaginate)

export const Vedio = mongoose.model("Vedio",vedioSchema)