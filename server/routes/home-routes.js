const mongoose = require('mongoose');
const Image = mongoose.model('Image');

const multiparty = require('connect-multiparty'),
multipartyMiddleware = multiparty()

const cloudinary = require('../services/cloudinary-service');

module.exports = function (app) {
    app.get('/images', getImages);
    app.post('/image', multipartyMiddleware, cloudinary.uploadImage);
}

function getImages(request, response) {
    const images = [];
    Image.find({ '_owner': request.session._id }, function (err, docs) {
        docs.forEach(e => images.push(e.url))
        response.status(200).json(images)
    })
}

