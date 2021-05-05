import mongoose from 'mongoose';
import dotenv from "dotenv";
import User from './models/user.js'
dotenv.config();

class DB{

    constructor(){  
        try {
            mongoose.connect( process.env.db, {useNewUrlParser: true, useUnifiedTopology: true}, () =>
            console.log("connected"));    
            }catch (error) { 
            console.log("could not connect");    
            }
        var db = mongoose.connection 
            db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function() {
            console.log('11');
        });
    }

    saveUser(username){  
        console.log(username);
        // const candidate = User.findOne({username}) 
        // if (candidate){ 
        //     console.log(candidate);
        //     return candidate
        // }
 
        const user = new User({username:username})
        console.log(user);
        user.save().then(result => {
            console.log('note saved!')
            mongoose.connection.close()
          })
    }

}

export default DB;