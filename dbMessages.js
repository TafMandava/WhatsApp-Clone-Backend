/*
    This is where we are going to define the data schema
    Outlines the data structure
*/
import mongoose from 'mongoose';

const whatsappSchema = mongoose.Schema({
    message: String,
    name: String,
    timestamp: String,
    received: Boolean
});

/*
    Give a name to the collection - messageContent
    i.e we can have multiple documents. In sql we have one database and many tables
    In mongo (no sql) collections are similar to tables (in sql)
    Use the whatsappSchema for this collection
*/
export default mongoose.model('messageContent', whatsappSchema);