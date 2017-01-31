const mongoose = require('mongoose');
const Image = mongoose.model('Image');

const multiparty = require('connect-multiparty'),
multipartyMiddleware = multiparty()

const cloudinary = require('../services/cloudinary-service');

module.exports = function (app) {
    app.get('/images', getImages);
    app.post('/image', multipartyMiddleware, cloudinary.uploadImage);
    // app.delete('/image/:id', deleteImage);
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
    console.log(id);
    cloudinary.deleteImageCloud();

    Image.find({_id: id}).remove((err, result) => {
        if (err)
            response.status(500).json(err)
        else 
    response.status(200).json({message : 'ok'})
    })
}
