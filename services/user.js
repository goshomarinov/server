const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');


const blacklist = new Set();

const JWT_SECRET = 't gcsergcserg  b920n3w4pc[w3tcawert6v9';

async function register(firstName, lastName, referral, email, password) {
    // check if email is taken
    const existing = await User.findOne({ email: new RegExp(`^${email}$`, 'i') });
    if (referral) {
        const ref = await User.findOne({ email: new RegExp(`^${referral}$`, 'i') });
        ref.referrals.push(email);

        await ref.save();
    }

    if (existing) {
        throw new Error('Email is taken');
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // store user
    const user = new User({
        firstName,
        lastName,
        email,
        referral: referral ? referral : [],
        hashedPassword,
    });

    await user.save();

    return createSession(user);
}

async function login(email, password) {
    // check if user exists
    const user = await User.findOne({ email: new RegExp(`^${email}$`, 'i') });

    if (!user) {
        throw new Error('Incorrect email or password');
    }

    // verify password
    const match = await bcrypt.compare(password, user.hashedPassword);

    if (!match) {
        throw new Error('Incorrect email or password');
    }

    return createSession(user);
}

function logout(token) {
    blacklist.add(token);
}

function createSession(user) {
    const payload = {
        email: user.email,
        _id: user._id,
        referral: user.referral,
        referrals: user.referrals,
        firstName: user.firstName,
        lastName: user.lastName
    };

    const accessToken = jwt.sign(payload, JWT_SECRET);

    return {
        email: user.email,
        accessToken,
        _id: user._id,
        referral: user.referral,
        referrals: user.referrals,
        firstName: user.firstName,
        lastName: user.lastName
    };
}

function validateToken(token) {
    if (blacklist.has(token)) {
        throw new Error('Token is blacklisted');
    }
    return jwt.verify(token, JWT_SECRET);
}

module.exports = {
    register,
    login,
    logout,
    validateToken
};