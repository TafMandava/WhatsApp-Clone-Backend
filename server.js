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
import Pusher from 'pusher';

/*
    app config
    Creating application instance
    Create the application and allow us tp create routes
    Create a port where the application is going to run
*/
const app = express();
const port = process.env.PORT || 9000;
/*
    What is Pusher?
    In firebase we can use a Realtime database
    That is when something is added or deleted the application is triggered. 
    At the exact same time the changes are going to be made on the client/ application side

    With mongoDB, this is not the case. 
    You will have to refresh the client page and refresh all the times or you will have to add functionality to invoke the APIs for instance after every 5 second 

    With Pusher we are going to introduce mongoBD change stream
    Implement a change stream that will be set to one of our collections.
    Whenever there are changes in that collection i.e a message is added, edited or deleted
    At that time the change stream is going to update the pusher and it's going to upload the message to pusher. We will connect it to our front end and the pusher server will trigger our front end and push down our data changes to the app. Followed by making a new api request to the backend. This will refresh everything. Thus making our application fully realtime 

    Pusher listens to the backend
    Everytime the backend changes the pusher informs the frontend resulting to the frontend reloading all the data
*/
const pusher = new Pusher({
    appId: "1134458",
    key: "711eaf04cbfc3efa3e97",
    secret: "e2d8d38ecc1e3c62ed67",
    cluster: "eu",
    useTLS: true
});
/*
    Adding change stream so that it triggers the pusher
    Change stream is going to listen to our application or database and if there are any changes it's going to trigger our pusher
    Once mongoose connection is open invoke a function that let's us know that our conection is working
    We want the function to fire off when something has changed in the database
*/
const db = mongoose.connection;
db.once('open', () => {
    console.log('DB Connected');
    /*
        Create a collection 
    */
   const msgCollection = db.collection('messagecontents');
   const changeStream = msgCollection.watch();
   /*
       Whenever there are changes we save it in a change variable which we console log
       If the change operation is an insert then there is a full document field outlined in the console log that we save in a variable messageDetails
       Then we trigger pusher, which has a channel challed 'messages', event called inserted and the object for console logging (we do not need to specify all the attributes in the object since we are only using it for console logging)
       If there is an error we just write to the console log
   */
   changeStream.on('change', (change) => {
       /*
           Change stream trigger pusher
       */
       console.log('A change occured', change);

       if(change.operationType === 'insert') {
           const messageDetails = change.fullDocument;
           pusher.trigger('messages', 'inserted',
               {
                   name: messageDetails.name,
                   message: messageDetails.message
               }
           );
       } else {
           console.log('Error triggering Pusher');
       }
   });
});

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