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
    app.get('/users/anonim', getUsersAnonim);
    app.get('/users/admin', getUsersAdmin);
    app.get('/users/user', getUsersUser);
    app.get('/users/:id', getPicturesForUser);
    app.get('/getUsernameForId/:id', getUsernameForId);
    app.get('/getIdFromSession', getIdFromSession);
    app.get('/getUserProfileForId/:id', getUserProfileForId);
    
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
};

function getIdFromSession(request, response) {
    if('session' in request) {
        if('_id' in request.session) {
            const id = request.session._id;
            console.log("idSession======================== " + id);
            response.status(200).json({id: id});
        }
    } else {
        response.status(200).json({id: ''});
    }
};

function getPicturesForUser(request, response) {
    // request.params.id - id of our user!!! this is name1 if users/name1
    const id = request.params.id // name of our user
    console.log("name" + id);
    const imagesForUser = [];
    Image.find({'_owner': id}, function (err, docs) {
        // docs.forEach(e => imagesForUser.push(e))
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

function getUsersAnonim (request, response) {
    const users = [];
    User.find({public: true}, function (err, docs) {
            docs.forEach(e => users.push(e));
            response.status(200).json(users);
        })
};

function getUsersAdmin (request, response) {
    console.log("Adminnnnnnnnnnnnnnnnnnn");
    const users = [];
    User.find({}, function (err, docs) {
        docs.forEach(e => users.push(e));
        response.status(200).json(users);
    })
};

function getUsersUser (request, response) {
    console.log("Userrrrrrrrrrrrrrrrrrrrrrrrrrrr");
    // we need public users and this user
    const users = [];
    const id = request.session._id; // name of our user
    User.find({'_id': id}, function (err, docs) {
        docs.forEach(e => users.push(e));
        if(users[0]){
            if('_doc' in users[0]){
                if('public' in users[0]._doc){
                    var user = users[0]._doc.public;
                    console.log("ispublic==========" + user);
                    if(user){
                        console.log("yessssssssssssssssssssssssss");
                        users.pop();
                    }
                }
            }
        };
        
    response.status(200).json(users);    
    });
    
};

function getUserProfileForId (request, response) {
    const id = request.params.id;// id for our user
    User.findOne({_id: id}, function(err, result){
        if(err){
            res.status(404);
        }
        if(result){
            response.status(200).send({public: result._doc.public});
        }
    })

};



