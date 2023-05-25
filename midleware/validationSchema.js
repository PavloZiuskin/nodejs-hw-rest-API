const {schemes} = require('../models/contact');
const {addSchema} = schemes;
const {HttpError} = require('../helpers')
const validation = (body)=>{
    const {error} = addSchema.validate(body);
        if(error){
            throw new HttpError(400,error.message);
        }
}

module.exports = {validation}