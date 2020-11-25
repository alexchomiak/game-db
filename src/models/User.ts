import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
    email: string
    firstName: string
    lastName: string
    password: string
}



const UserSchema = new Schema({
    email: String,
    firstName: String,
    lastName: String,
    password: String,  
})

export default mongoose.model<IUser>('User', UserSchema)
