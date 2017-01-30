const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const mongoose = require('mongoose');
const User = mongoose.model('User');
const configAuth = require('./auth-config');

passport.use(new LocalStrategy({
		usernameField: 'email'
	},
	function (username, password, done) {
		User.findOne({
			'local.email': username
		}, function (err, user) {
			if (err) {
				return done(err);
			}

			if (!user) {
				return done(null, false, {
					message: 'Incorrect email or password.'
				});
			}

			if (!user.validPassword(password)) {
				return done(null, false, {
					message: 'Incorrect email or password.'
				});
			}
			return done(null, user);
		});
	}
));

passport.use(new GitHubStrategy({
		clientID: configAuth.gitHubAuth.clientID,
		clientSecret: configAuth.gitHubAuth.clientSecret,
		callbackURL: configAuth.gitHubAuth.callbackURL
	},
	function (token, refreshToken, profile, done) {
		process.nextTick(function () {
			User.findOne({
				'github.id': profile.id
			}, function (err, user) {
				if (err) done(err);

				if (user) {
					return done(null, user); // user found, return that user
				} else {
					// if there is no user found with that facebook id, create them
					var newUser = new User();

					// set all of the facebook information in our user model
					newUser.github.id = profile.id; // set the users facebook id                   
					newUser.github.token = token; // we will save the token that facebook provides to the user  
					newUser.github.name = profile.username

					// save our user to the database
					newUser.save(function (err) {
						if (err) {
							console.log(err);
						}

						// if successful, return the new user
						return done(null, newUser);
					});
				}
			});
		});
	}
));