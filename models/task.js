const mongoose=require('mongoose');

const taskschema=new mongoose.Schema({
    id:{
        type:String,
        required:true,
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        enum: ['pending', 'in-progress', 'completed'],
        default:'pending'
    }
},{timestamps:true});

const TASKS=new mongoose.model('tasks',taskschema);

module.exports=TASKS;