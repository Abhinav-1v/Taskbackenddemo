const {Router}=require('express');
const {nanoid}=require('nanoid');
const TASKS = require('../models/task');


const router=Router();


router.post('/',async(req,res)=>{
    const {title,description}= req.body;
    const id=nanoid(4);
    const newtask=TASKS.create({
        id,
        title,
        description
    });
    return res.json(newtask);
});

router.get('/',async (req,res)=>{
    const tasks=await TASKS.find({});
    return res.json(tasks);
});

router.get('/:id',(req,res)=>{
    
})

module.exports=router;