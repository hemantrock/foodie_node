const express = require('express');
const morgan = require('morgan');
const app = express();
const connectDB = require('./config/database');
const User = require('./models/User');
const FoodRoute=require('./routes/food');
const passport=require('passport');
const { initializingPassport } = require('./config/passport');
const session = require('express-session');
const cors = require('cors');

// const bodyParser = require('body-parser');

// Connect to MongoDB
connectDB();
initializingPassport(passport);

const corsOptions ={
  origin:'http://localhost:8100', 
  credentials:true,//access-control-allow-credentials:true
  // optionSuccessStatus:200
}
app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'food123', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());


app.use('/recipe',FoodRoute)
app.use(morgan('dev'))


app.post('/user/login', passport.authenticate('local'), async (req,res) => {
  try {
    let user = await User.findOne(req.body).select("-password");
    res.status(200).send({
      data:user,
      message:"logged in Successfully."
    }) 
  } catch (error) {
    res.status(200).send("logged In Failed")
  }
});


app.post('/user/register', async(req, res) => {
  const  user= await User.findOne({
    username:req.body.username
  })
  if(user) return res.status(400).send("User Already Exists");
  const newUser=await User.create(req.body);
  res.status(200).send({
    data:newUser,
    message:"User Created Successfully"
  })
});
app.post('/user/update/:id', async(req, res) => {
  try {
    const result = await User.updateOne({ _id: req.params.id },req.body);
    res.status(200).send({data:result,message:"Updated SuccessFully.."});
  } catch (error) {
    res.status(400).send({error:error,message:"Error"});
  }
});

// app.get('/user/logout', (req, res) => {
//   req.logout();
//   res.status(200).send({message:"Logged Out"})
// });

app.use((req,res,next)=>{
  const error =new Error('Not Found');
  error.status=404;
  next(error);
})

app.use((error,req,res,next)=>{
  res.status(error.status || 500);
  res.json({
      error:{
          message:error.message
      }
  })
})


module.exports= app;
