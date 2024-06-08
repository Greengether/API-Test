import mongoose, {Schema} from "mongoose"

export interface IEvent extends Document {
    name: string;
    date: Date;
    description?: string;
}
const eventSchema = new Schema<IEvent>({
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

const eventModel = mongoose.model("Event", eventSchema)
export default eventModel