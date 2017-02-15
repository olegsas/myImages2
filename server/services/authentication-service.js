const passport = require('passport'),
	  mongoose = require('mongoose'),
	  User = mongoose.model('User');

const sendJSONresponse = function (res, status, content) {
	res.status(status);
	res.json(content);
};

module.exports.register = function (req, res) {
	if (!req.body.name || !req.body.email || !req.body.password) {
		sendJSONresponse(res, 400, {
			"message": "All fields required"
		});
		return;
	}
	
	var user = new User();
	user.local.name = req.body.name;
	user.local.email = req.body.email;
	user.setPassword(req.body.password);
	user.save(function (err, response) {
		var token;

		if (err) {
			sendJSONresponse(res, 404, err);
		} else {
			token = user.generateJwt();
			req.session._id = response._doc._id;
			req.session.token = token;
			sendJSONresponse(res, 200, {
				"token": token
			});
		}
	});
};

module.exports.login = function (req, res) {
	if (!req.body.email || !req.body.password) {
		sendJSONresponse(res, 400, {
			"message": "All fields required"
		});
		return;
	}
	passport.authenticate('local', function (err, user, info) {
		var token;
		if (err) {
			console.log("= = = 1");
			sendJSONresponse(res, 404, err);
			return;
		}
		if (user) {
			token = user.generateJwt();
			req.session._id = user._doc._id;
			req.session.token = token;
			console.log("= = = 2");
			sendJSONresponse(res, 200, {
				"token": token
			});
		} else {
			console.log("= = = 3");
			sendJSONresponse(res, 401, info);
		}
	})(req, res);
};

module.exports.getUserProfile = function(req, res){
	User.findOne({_id: req.session._id}, function(err, result){
		if(err){
			sendJSONresponse(res, 404, err);
			return;
		}
		if(result){
			//res.send({public:result});
			// console.log("server ansver" + result);
			// console.log(result.public);
			res.send({public: result.public}); // for the debug only
		}
	})
}

module.exports.updateProfile = function(req, res){
	User.update({
        "_id": req.session._id
    }, {
        "public": req.body.public
    }, (err, response) => {
        if (err) {
            return handleError(err)
        }
        res.status(200).json({
            public: req.body.public
        })
    })
	
	
}

module.exports.getUserName = function(req, res){
	User.findOne({_id: req.session._id}, function(err, result){
		if(err){
			sendJSONresponse(res, 404, err);
			return;
		}
		if(result){
			//res.send({public:result});
			// console.log("server ansver" + result);
			// console.log(result.local.name);
			res.send({name: result.local.name});
		}
	})
}
