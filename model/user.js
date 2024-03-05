const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');



const UserSchema = new Schema({
    role : {
        type : String,
        required : true
    }
})

// You're free to define your User how you like. Passport-Local Mongoose (User.plugin) will add a username, hash and salt field to store the username, the hashed password and the salt value.

UserSchema.plugin(passportLocalMongoose); //This will add two field named username, password;

module.exports = mongoose.model('User', UserSchema);