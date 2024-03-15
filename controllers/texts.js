const Texts = require('../models/textmodel');

exports.write = async (req,res) => {
    console.log(req.body)
    const { text,lang } = req.body;
    const txt = await Texts.create({text,lang});
    return res.status(200).json({success:true,url:txt._id})
}

exports.read = async (req,res) => {
    const { id } = req.params;
    const txt = await Texts.findById(id);

    if (!txt) return res.status(404).json({success:false,message:'Not found'});

    return res.status(200).json({success:true,message:'Fetched successfully',texts:txt.text});

}