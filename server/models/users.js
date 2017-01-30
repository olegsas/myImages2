const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const Schema = mongoose.Schema;

const userSchema = new Schema({
	local: {
		email: {
			type: String,
			unique: true
				//required: true
		},
		name: {
			type: String
				//required: true
		},
		hash: String,
		salt: String
	},
	isAdmin: {type: Boolean, default: false},
	public: {type: Boolean, default: false},
	facebook: {
		id: {
			type: String
		},
		token: {
			type: String
		},
		//email: String,
		name: String
	},
	github: {
		id: {
			type: String
		},
		token: {
			type: String
		},
		name: {
			type: String
		}
	},
	images: [{ type: Schema.Types.ObjectId, ref: 'Image' }]

});

userSchema.methods.setPassword = function (password) {
	this.local.salt = crypto.randomBytes(16).toString('hex');
	this.local.hash = crypto.pbkdf2Sync(password, this.local.salt, 1000, 64).toString('hex');
};

userSchema.methods.validPassword = function (password) {
	const hash = crypto.pbkdf2Sync(password, this.local.salt, 1000, 64).toString('hex');
	return this.local.hash === hash;
};

userSchema.methods.generateJwt = function () {
	const expiry = new Date();
	expiry.setDate(expiry.getDate() + 7);

	return jwt.sign({
		_id: this._id,
		email: this.local.email,
		name: this.local.name,
		exp: parseInt(expiry.getTime() / 1000)
	}, 'process.env.JWT_SECRET');
};

mongoose.model('User', userSchema);