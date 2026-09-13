const asyncHandler=require('express-async-handler'); const Destination=require('../models/Destination'); const {evaluate}=require('../services/evaluationService');
const getEvaluation=asyncHandler(async(req,res)=>{const d=await Destination.find({}); res.json({success:true,data:evaluate(d)});}); module.exports={getEvaluation};
