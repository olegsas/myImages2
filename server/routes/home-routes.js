const mongoose = require('mongoose');
const Image = mongoose.model('Image');
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
}

function getImages(request, response) {
    const images = [];
    Image.find({ '_owner': request.session._id }, function (err, docs) {
        docs.forEach(e => images.push(e))
        response.status(200).json(images)
    })
}

function deleteImage (request, response) {
    const id = request.params.id;
    console.log("id===" + id); 
    Image.findOne({_id: id}, function(err, result){
        console.log("go!!");
        if(err){
            console.log("err find");
            sendJSONresponse(res, 404, err);
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
                    sendJSONresponse(res, 404, err);
                    return;
                }
            });
        };
    });
};
