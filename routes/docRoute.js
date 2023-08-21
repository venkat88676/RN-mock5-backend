const express=require("express");

const {DocModel}=require("../model/docModel")

const docRoute=express.Router();

docRoute.post('/',async(req,res)=>{
    try{
        const payload=req.body
        const post=new DocModel(payload)
        await post.save()
         res.status(201).send({"msg":"New Details Added"}) 
    }catch(err){
        res.status(400).send({"msg":err.message}) 
    }
    
})

docRoute.get('/',async(req,res)=>{
  
    try {
        const { specialization, sortBy, search } = req.query;
        console.log(specialization,sortBy,search)
        let query = DocModel.find();
        let sort = 1; 
        if (specialization) {
            query = query.where('specialization', specialization);
        }
        if(search){
            query = query.where('name', new RegExp(search, 'i'));
        }

        sortBy==="asc"?sort=1:sort=-1
        query = query.sort({ date: sort });

        const bookings = await query.exec();
        res.status(200).send(bookings);
    } catch (err) {
        res.status(400).send({ "msg": err.message });
    }
    
})

docRoute.patch("/:id",async(req,res)=>{
    const docId=req.params.id;
    const payload=req.body;
    try{
        await DocModel.findByIdAndUpdate({_id:docId},payload);
        res.send({"msg":"updated successfully"})
    }catch(err){
        res.send({"msg":err.message})
    }
})

docRoute.delete('/:id',async(req,res)=>{
    const postId=req.params.id
    try{
        const deletedData=await DocModel.findByIdAndDelete({_id:postId})
        res.status(202).send({"msg":"Deleted"})
    }
    catch(err){
        res.send(err)
    }
    
})

module.exports={docRoute}