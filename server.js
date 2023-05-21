const app = require('./app')
const mongoose = require('mongoose');
const {DB_HOST,Port} = process.env;
mongoose.set('strictQuery', true);
mongoose.connect(DB_HOST)
  .then(()=>{app.listen(Port)})
  .catch(error=>{
    console.log(error.message);
    process.exit(1);
  }); 

