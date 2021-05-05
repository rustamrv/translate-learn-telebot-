import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const model = mongoose.model;

const schema = new Schema({
    username: {type: String, required:true},
    firstname: {type: String} 
})

const User = model('User', schema)

export default User;