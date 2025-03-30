const express = require('express')
const { body, validationResult } = require('express-validator') 
const Task = require('../models/task')
const auth = require('../middleware/auth')

const router = express.Router()

router.post(
	'/tasks',
	auth,
	[
	body('title', 'Title is required').trim().notEmpty().isLength({max:20}),
	body('status', 'A status is required').trim().notEmpty().isLength({max:20}),
	body('description', 'The description must be shorter').trim().isLength({max:30}),
	],
	async(req,res)=>{
	const errors = validationResult(req)
	if (!errors.isEmpty()){
	return res.status(400).json({ errors: errors.array() })
}
	try{
        const userId = req.user.id
        console.log("Request Body:", req.body); // Add this line
        const { title, status, description } = req.body

        let newTask = new Task({
        title,
        status,
        description,
        user : userId
})
        let task = await newTask.save()
        return res.status(201).json({ msg: 'Task succesfully created', task})

}	
	catch(err){
	res.status(500).json({ error : 'Internal server error'})	
}})

router.get(
	'/tasks',
	auth,
	async (req, res) =>{
	const userId = req.user.id
	try {
	const tasks = await Task.find({user : userId})
	return res.status(200).json(tasks)
}	catch(err){
	res.status(500).json({error: err})	
}})

router.patch(
	'/tasks/:id',
	auth,
	[
        body('title', 'A title is required').trim().notEmpty().isLength({max:20}),
        body('description', '').trim().isLength({max:30}),
        body('status', '').trim().notEmpty().isLength({max:20}),
        ],
	async (req, res) =>{
	const errors = validationResult({req})
	if (!errors.isEmpty()){
	res.status(400).json({error : errors})
}	try{	
	const task = await Task.findById(req.params.id)
	if(!task){
	res.status(404).json({error : 'That task does not exist'})
}	if(req.user.id !== task.user.toString()){
	res.status(403).json({ error: 'Not authorized to update this task'})
}
	const { title, description, status} = req.body

	task.title = title
	task.description = description
	task.status = status
	await task.save()
	return res.status(200).json({ task , msg : 'Task succesfully updated'})
}	catch(err){
	res.status(500).json({ error : err})
}})

router.delete(
	'/tasks/:id',
	auth,
	async (req, res) =>{
	try{
	const task = await Task.findById(req.params.id)
	if (!task){
	res.status(404).json({error: 'Task not found'})
}
	const user = task.user
	if (req.user.id !== task.user.toString()){
	res.status(403).json({error : 'Unauthorized'})
}
	await task.deleteOne()
	return res.status(200).json({msg: 'Task succesfully deleted'})
}	catch(err){
	res.status(500).json({error: 'Internal server error'})
	console.error(err)
}})


module.exports = router
