const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "The name field is required."]
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        required: [true, "The email field is required."],
        validate: [validator.isEmail, 'Please tell us your email'],
        unique: true
    },
    photo: {
        type: String,
        default: './img/user/chatapp.jpg',
    },
    password: {
        type: String,
        minlength: 8,
        required: [true, "please provide a  password. password must contain 8 character!"],
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'please confirm your password'],
        validate: {
            validator: function (el) {
                if (this.password) return this.password === el
            },
            message: "password does't match!"
        }
    },
    friends: {
        type: Array,
        default: []
    },
    active: {
        type: Boolean,
        default: false
    },
    resetTokenExpire: Date,
    passwordResetToken: String,
    passwordChangeAt: Date


})

// password hashing for security 
userSchema.pre('save', async function (next) {
    // check password change or not change
    // password hashing for saveing data base 
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12)
    this.passwordConfirm = undefined;
    next()
});
userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next();
    this.passwordChangeAt = Date.now() - 1000;
    next()
});

userSchema.methods.correctPassword = async function (candidatePassword, password) {
    return await bcrypt.compare(candidatePassword, password);
}
userSchema.methods.createPasswordResetToken = function () {
    // create random token
    const resetToken = crypto.randomBytes(12).toString('hex');
    // encrypted reset token
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.resetTokenExpire = Date.now() + 10 * 60 * 1000;
    return resetToken;
};
userSchema.methods.changePasswordAfter = function (jwtTimesTemp) {
    if (this.passwordChangeAt) {
        const changeTimesTemp = parseInt((this.passwordChangeAt.getTime() / 1000), 10);
        return jwtTimesTemp < changeTimesTemp;
    }
    // false means password not change 
    return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
