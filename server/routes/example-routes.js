
router.post('/getCurrentUser',function(request,response){
    User.findOne({_id:request.session._id},function(err,user){
        if(err){
            response.status(400).send({err:"Error"});
        }
        response.status(200).send({username:user.username,_id:user._id,private:user.private,isAdmin:user.isAdmin});
    })
});

router.post('/getImagesCurrentUser',function(request,response){
    var currentImagesArray = [];
    Image.find({"_owner":request.session._id},function(err,data){
        if (err){
            response.status(400).send({err:"Error"});
        }else{
            data.forEach(function(im){
                currentImagesArray.push({url:im.url,id:im.public_id})
            })
            response.json(currentImagesArray)
        }
    })  
})
