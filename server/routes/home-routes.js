const mongoose = require('mongoose');
const Image = mongoose.model('Image');
const User = mongoose.model('User');
const cloudinary = require('cloudinary');// for the debug


const multiparty = require('connect-multiparty'),
multipartyMiddleware = multiparty()

// const cloudinary = require('../services/cloudinary-service'); for the debug

cloudinary.config({// debug
    cloud_name: 'do5zrocew',// debug
    api_key: '176984263871615',//debug
    api_secret: '-4H2VvXsGsXn3O8zPU1HenjCZm8'//debug
});//debug

function uploadImage(req, res, next) {// all function for debug
        console.log("Upload req.files=" + req.files);
        if (req.files.image) {
            cloudinary.uploader.upload(req.files.image.path, function (result) {
                if (result.url) {
                    // req.imageLink = result.url;
                    var image = new Image();
                    image.url = result.url;
                    image._owner = req.session._id;
                    image.public_id = result.public_id;
                    image.save((err, response) => {
                        res.status(201).json(result.url)
                    })
                } else {
                    res.json(error);
                }
            });
        } else {
            next();
        }
    };


module.exports = function (app) {
    app.get('/images', getImages);
    app.post('/image', multipartyMiddleware, uploadImage);
    app.delete('/image/:id', deleteImage);
    app.get('/users', getUsers);
    app.get('/users/:id', getPicturesForUser);
    app.get('/getUsernameForId/:id', getUsernameForId);
    app.post('/updateProfile', updateProfile);
    app.get('/getUserProfile', getUserProfile);
    app.get('/getUserName', getUserName);
}

function getImages(request, response) {
    const images = [];
    Image.find({ '_owner': request.session._id }, function (err, docs) {
        docs.forEach(e => images.push(e))
        response.status(200).json(images)
    })
};

function getUsernameForId(request, response) {
    const id = request.params.id;// id for our user
    User.findOne({'_id': id}, function (err, doc) {
        const name = doc.local.name;
        response.status(200).json({name: name});
    })
}

function getPicturesForUser(request, response) {
    // request.params.id - id of our user!!! this is name1 if users/name1
    const id = request.params.id // name of our user
    console.log("name" + id);
    const imagesForUser = [];
    Image.find({'_owner': id}, function (err, docs) {
        docs.forEach(e => imagesForUser.push(e))
        response.status(200).json(imagesForUser)
    })
};

function deleteImage (request, response) {
    const id = request.params.id;
    console.log("id===" + id); 
    Image.findOne({_id: id}, function(err, result){
        console.log("go!!");
        if(err){
            console.log("err find");
            res.json(err);
            return;
        }
        if(result){
            console.log("server answer - " + result);
            console.log("result public_id = " + result.public_id);
            cloudinary.uploader.destroy(result.public_id, function (resultCloud) {
                console.log(resultCloud) 
                if(resultCloud){
                    /// ok we can delete from monga
                    Image.find({_id: id}).remove((err, result) => {
                        if (err)
                            response.status(500).json(err)
                        else
                            response.status(200).json({message: 'OK'})
                    });
                } else {
                    res.json(err);
                    return;
                }
            });
        };
    });
};

function getUsers (request, response) {
    const users = [];
    User.find({}, function (err, docs) {
        // console.log("docs = " + docs);
        // console.log("docs local name = " + docs[1].local.name);
        // docs.forEach(e => console.log("e= " + e.local.name));
        docs.forEach(e => users.push(e));
        // users.push(docs[0].local.name);
        // users.push(docs[1].local.name);
        // console.log("after push = " + users[0]);
        response.status(200).json(users);
    })

};

function getUserName (req, res){
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
};

function updateProfile (req, res){
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
	
};

function getUserProfile (req, res){
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
};
