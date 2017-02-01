// const cloudinary = require('cloudinary');
// const mongoose = require('mongoose');
// const Image = mongoose.model('Image');

// cloudinary.config({
//     cloud_name: 'do5zrocew',
//     api_key: '176984263871615',
//     api_secret: '-4H2VvXsGsXn3O8zPU1HenjCZm8'
// });

// module.exports = {

//     uploadImage: function (req, res, next) {
//         console.log("Upload req.files=" + req.files);
//         if (req.files.image) {
//             cloudinary.uploader.upload(req.files.image.path, function (result) {
//                 if (result.url) {
//                     // req.imageLink = result.url;
//                     var image = new Image();
//                     image.url = result.url;
//                     image._owner = req.session._id;
//                     image.save((err, response) => {
//                         res.status(201).json(result.url)
//                     })
//                 } else {
//                     res.json(error);
//                 }
//             });
//         } else {
//             next();
//         }
//     },

//     deleteImageCloud: function (req, res, next) { 
//         console.log("delete image!"); 
//         console.log("Delete req.files=" + req.files);
//         // if (req.files.image) { 
//         //     console.log("Destroy image"); 
//         //     cloudinary.uploader.destroy(req.files.image.path, function (result) { 
//         //         if (result.url) { 
//         //             // req.imageLink = result.url; 
 
//         //         } else { 
//         //             res.json(error); 
//         //         } 
//         //     }); 
//         // } else { 
//         //     next(); 
//         // } 
//     }
// };
