const express=require('express');
const mongoose=require('mongoose');

const app=express();
const PORT=process.env.PORT || 5555;

const taskrouter=require('./routes/task');

app.use(express.urlencoded({extended:false}));
app.use(express.json());

mongoose.connect(process.env.MONGO_URL ||'mongodb://127.0.0.1:27017/demotasks')
.then(()=>console.log('MongoDB connected'))
.catch(e=>console.log('Error connecting MongoDB',e.message));


app.get('/',(req,res)=>{
    return res.send('HELLO!!');
});

app.use('/tasks',taskrouter);



app.listen(PORT,()=>console.log('Server Started at PORT:',PORT));