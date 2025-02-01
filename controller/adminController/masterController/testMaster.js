const Test=require('../../../model/adminModel/masterModel/test');

/// Add Test
const addTest= async(req,res)=>{
    try {
        const newTest=req.body;
        const createTest=await Test.create(newTest);
        res.status(201).json({message:'Test created succesfully',data:createTest});
    } catch (error) {
         res.status(400).send('Something went wrong');
    }
}

//Get Test

const getTest=async (req,res) => {
    try {
        const newTest=await Test.findAll();
        res.status(200).json(newTest);
    } catch (error) {
        res.status(400).send('Something went wrong');
    }
}

/// Update Test

const updateTest=async (req,res) => {
    try {
        const id=req.params.id;
        const newTest = await Test.findByPk(id); 
        newTest.update(req.body); 
        res.json(newTest);
    } catch (error) {
        res.status(400).send('Something went wrong');
    }
    
}


module.exports={addTest,getTest,updateTest}