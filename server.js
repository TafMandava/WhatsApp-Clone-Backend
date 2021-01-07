/* 
    importing
    importing express
*/
import express from 'express';
/*
    This is the client that's connecting to our database
*/
import mongoose from 'mongoose';
import Messages from './dbMessages.js';

/*
    app config
    Creating application instance
    Create the application and allow us tp create routes
    Create a port where the application is going to run
*/
const app = express();
const port = process.env.PORT || 9000;

/*
    middleware
*/

/*
    db config
    Pass in connection_url and configuration values to help mongoose connect to the dayabase
*/
const connection_url = 'mongodb+srv://admin:2Wj2yj6U4Maj0FgS@cluster0.7trec.mongodb.net/whatsappdb?retryWrites=true&w=majority';
mongoose.connect(connection_url, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

/*
    all the mongo stuff
*/

/*
    api routes
    Once our server is invoked via a get method
    '/' end-point route
    Use in conjuction with a function that is invoked when the route fires off
    Set the response status code to 200 and send Hello World!
    200 range OK
    201 created - used when we send a message and the message was stored successfully in the database
    Creating api route which we will be using to post messages into mongoDB
*/
app.get('/', (req, res) => res.status(200).send('Hello World!')); 
app.post('/api/v1/messages/new', (req, res) => {
    const dbMessage = req.body;
    
    /*
        Passing in the message structure in the request body and saving into Messages
        Using mongoose to create a new message using the content that we sent in the bpdy
        Handle the error
    */
    Messages.create(dbMessage, (error, data) => {
        if(error) {
            res.status(500).send(error);
        } else {
            res.status(201).send(data);
        }
    });
});

/*
    listen
    Before we run the application we have to make it listen to what we say
    Add the port where it should listen and run to console log if it is working
*/
app.listen(port, () => console.log(`Listening on localhost:${port}`));