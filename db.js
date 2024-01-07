const mongoose = require('mongoose');
require('dotenv').config();
const connection  = mongoose.connect(`${process.env.Mongo_Db_Atlas_Url}`);



module.exports = {connection};