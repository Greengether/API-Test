import mongoose from "mongoose"

export interface IEvent extends Document {
    name: string;
    date: Date;
    description?: string;
}
const eventSchema = new mongoose.Schema<IEvent>({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    date: {
        type: Date,
        required: true,
        default: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1)
    }
})

export default mongoose.model("Event", eventSchema)