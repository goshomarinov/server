const { Schema, model, Types: { ObjectId } } = require('mongoose');


const userSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    hashedPassword: { type: String, required: true },
    referral: { type: []},
    referrals: { type: []},
});

userSchema.index({ email: 1 }, {
    collation: {
        locale: 'en',
        strength: 1
    }
});

const User = model('User', userSchema);

module.exports = User;