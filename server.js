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

    post results without middleware
    {
        "_id": "5ff73d407b2a7e9a28871fd7",
        "__v": 0
    }

    post results with middleware
    {
        "_id": "5ff74a56d7a0699b8b68fa46",
        "message": "WhatsApp Messenger is a FREE messaging app",
        "name": "Tafadzwa Mandava",
        "timestamp": "Wed, 06 Jan 2021 22:49:25 GMT",
        "received": false,
        "__v": 0
    }
*/
app.use(express.json());

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
    200 range OK for downling or getting data
    201 created for uploading posting data - used when we send a message and the message was stored successfully in the database
*/
app.get('/', (req, res) => res.status(200).send('Hello World!')); 
/*
    Creating an api that will return all the data that we have in our database
*/
app.get('/api/v1/messages/sync', (req, res) => {
    Messages.find((error, data) => {
        if(error) {
            res.status(500).send(error);
        } else {
            res.status(200).send(data);
        }
    });
});

/*
    Creating api route which we will be using to post messages into mongoDB
    Do not post without spefifying the middleware settup app.use(express.json());
*/
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