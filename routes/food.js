
const express = require('express');
const router = express.Router();
const Food =require('../models/Food');
const multer = require('multer');
const path = require('path');
const app=express();
const fs = require('fs');

// Set up multer storage
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
var upload = multer({ storage: storage })

// Serve static files
app.use('/a',express.static('/b'));

// Handle POST request for submitting the recipe form
app.use(express.static(__dirname + '/pu'));
app.use('/uploads', express.static('uploads'));


// update recipe with image
router.post('/upload/:id', upload.single('image'), async (req, res, next)=> {
  console.log(JSON.stringify(req.file))

  try {
    const result = await Food.updateOne({ _id: req.params.id },req.body);
    res.status(200).send({data:result,message:"Updated SuccessFully.."});
    var response = '<a href="/">Home</a><br>'
    response += "Files uploaded successfully.<br>"
    response += `<img src="${req.file.path}" /><br>`
   // return res.send(response)
  } catch (error) {
    res.status(400).send({error:error,message:"Error"});
  }
})


// upload multiple
router.post('/upload-multiple', upload.array('image', 12), function (req, res, next) {

  var response = '<a href="/">Home</a><br>'
  response += "Files uploaded successfully.<br>"
  for(var i=0;i<req.files.length;i++){
      response += `<img src="${req.files[i].path}" /><br>`
  }  
  return res.send(response)
})

// list all recipe
router.get("/", async(req, res, next) => {
  const data= await Food.find();
  if(data)   res.status(200).send({data:data,path:res.json, message: "List Fetched",});

});

router.get("/filter/:type/:dir", async(req, res, next) => {
  const type=req.params.type;
  const val=(req.params.dir == true?1:-1)
  if(type == 'title'){
    const data= await Food.find().sort({title:val});
    if(data)   res.status(200).send({data:data,path:res.json, message: "List Fetched",});
  }else if(type == 'Ingredients'){
    const data= await Food.find().sort({ingredients:val});
    if(data)   res.status(200).send({data:data,path:res.json, message: "List Fetched",});
  }else if(type == 'Instructions'){
    const data= await Food.find().sort({instructions:val});
    if(data)   res.status(200).send({data:data,path:res.json, message: "List Fetched",});
  }


});


// add recipe with image
router.post("/add", upload.single('image'), async(req, res, next) => {
  // console.log("data",JSON.stringify(req.file))
  const data= await Food.findOne({title:req.body.title});
  if(data){
    res.status(400).send({message: "Reciepe Already exists.",});
  }else{
    try {
      const dataobj=new Food({
        title:req.body.title,
        ingredients:req.body.ingredients,
        instructions:req.body.instructions,
        image:req.file.filename,
      })
      const result = await dataobj.save();
      var response = '<a href="/">Home</a><br>'
      response += "Files uploaded successfully.<br>"
      response += `<img src="${req.file.path}" /><br>`
      
      res.status(200).send({data:result,message:"Added SuccessFully.."});
    
    } catch (error) {
      res.status(400).send({error:error,message:"Error"});
    }
  } 
});


// delete recipe with id 
router.delete("/delete/:id", async (req, res) => {
  try {
    const result = await Food.deleteOne({ _id: req.params.id });
    res.status(200).send({data:result,message:"Deleted SuccessFully.."}) 
  } catch (error) {
    res.status(400).send({error:error,message:"Not Deleted"});
  }
});

// router.post("/update/:id", async (req, res) => {
//   try {
//     const result = await Food.updateOne({ _id: req.params.id },req.body);
//     res.status(200).send({data:result,message:"Updated SuccessFully.."});
//   } catch (error) {
//     res.status(400).send({error:error,message:"Error"});
//   }
// });

module.exports = router;
