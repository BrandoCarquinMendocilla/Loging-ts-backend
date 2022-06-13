import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullname: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updateAt: Date
})

export default model('User', userSchema)