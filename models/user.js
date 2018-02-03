const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
	email: {type: String, required: true},
	password: {type: String, required: true, select: false},
	pushoverKey: String,
	telegramUsername: String
});

userSchema.pre('save', function (next) {
	const user = this;

	if (!user.isModified('password')) {
		return next();
	}

	bcrypt.hash(user.password, 10, function (err, hash) {
		if (err) return next(err);
		user.password = hash;
		next();
	});
});

userSchema.methods.comparePassword = function (candidatePassword) {
	return bcrypt.compare(candidatePassword, this.password).then(isValid => {
		return {isValid, user: this};
	});
};

module.exports = mongoose.model('User', userSchema);