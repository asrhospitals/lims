const Nodal=require('../../../model/adminModel/masterModel/nodalMaster');

/// Add Nodal
const addNodal=async(req,res)=>{
    try {
        const newNodal=req.body;
        const createNodal=await Nodal.create(newNodal);
        res.status(201).json(createNodal);
    } catch (error) {
        res.status(400).send({message:"Something went wrong"});
    }
};


/// Get Nodal

const getNodal=async(req,res)=>{
    try {
        const findNodal=await Nodal.findAll();
        res.status(200).json(findNodal);
    } catch (error) {
        res.status(400).send({message:"Something went wrong"});
    }
};


/// Update NOdal
const updateNodal=async(req,res)=>{
    try {
        const id=req.params.id;
        const updatenodal=await Nodal.findByPk(id);
        updatenodal.update(req.body);
        res.status(200).json(updatenodal)
    } catch (error) {
        res.status(400).send({message:"Something went wrong"});
    }
};

module.exports={addNodal,getNodal,updateNodal}