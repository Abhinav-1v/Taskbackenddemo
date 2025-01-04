const {Router}=require('express');
const {nanoid}=require('nanoid');
const TASKS = require('../models/task');


const router=Router();

//ADD NEW TASK ROUTE
router.post('/',async(req,res)=>{
    const {title,description}= req.body;
    const id=nanoid(5);
    try{
        const newtask=await TASKS.create({
            id,
            title,
            description
        });
        return res.status(201).json(newtask);
    }
    catch(e){
        return res.status(400).send('Cant post request: ',e.message);
    }
});

//GET ALL TASKS ROUTE
router.get('/',async (req,res)=>{
    const tasks=await TASKS.find({});
    return res.status(200).json(tasks);
});

//GET TASK BY ID ROUTE
router.get('/:id',async(req,res)=>{
    const id=req.params.id;
    const task=await TASKS.findOne({id});
    if(task){
        return res.status(200).json(task);
    }
    else{
        return res.status(404).json({error:'Task not found'});
    }
});

// UPDATE TASK STATUS ROUTE 
// REQUIRES STATUS INPUT FROM FRONTEND 
// ALLOWED STATUS UPDATE ->['pending', 'in-progress', 'completed'];

router.put('/:id',async(req,res)=>{
    const {id} = req.params;
    const {status} = req.body;

    if (!['pending', 'in-progress', 'completed'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status. Valid statuses are pending, in-progress, or completed.' });
    }
    try {
        const updatedTask = await TASKS.findOneAndUpdate({id},{status},{new:true});
        if (!updatedTask) {
            return res.status(404).json({error:'Task not found'});
        }
        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({error:'Error updating task status'});
    }
});

//DELETE TASK BY ID ROUTE
router.delete('/:id', async (req, res) => {
    const {id} = req.params; 
    try {
        const deletedTask= await TASKS.findOneAndDelete({id});
        if (!deletedTask) {
            return res.status(404).json({error:'Task not found'});
        }
        res.status(200).json({message:'Task deleted successfully'});
    } catch (error) {
        res.status(500).json({error:'Error deleting task'});
    }
});

module.exports=router;