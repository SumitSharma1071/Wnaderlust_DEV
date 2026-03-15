const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose').default;
const findOrCreate = require('mongoose-findorcreate');

const userSchema = new Schema({
    username: { type: String },  // required by passport-local-mongoose
    email: { type: String, required: true, unique: true },
    googleId: { type: String },  // for Google OAuth
});

userSchema.plugin(passportLocalMongoose, { usernameField: 'username' }); // usernameField optional, default is 'username'
userSchema.plugin(findOrCreate);

const User = mongoose.model('User', userSchema);

module.exports = User;