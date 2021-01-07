/* 
    importing
    importing express
*/
import express from 'express';

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
*/

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
*/
app.get('/', (req, res) => res.status(200).send('Hello World!')); 

/*
    listen
    Before we run the application we have to make it listen to what we say
    Add the port where it should listen and run to console log if it is working
*/
app.listen(port, () => console.log(`Listening on localhost:${port}`));