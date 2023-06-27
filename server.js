
const app=require('./index');

const PORT=process.env.PORT || 3000;

// app.use(express.urlencoded({ extends: true }));
app.listen(PORT,()=>{
    console.log(" i am listing ")    
});