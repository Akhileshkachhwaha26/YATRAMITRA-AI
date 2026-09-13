const asyncHandler = require('express-async-handler');
const { getImpactMetrics } = require('../services/impactService');
const getImpact = asyncHandler(async (req,res)=>res.json({success:true,data:await getImpactMetrics()}));
module.exports={getImpact};
