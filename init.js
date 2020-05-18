var {app,session} = require("./app");
var webSocket = require("./socket");

const PORT = process.env.PORT || 5000;

const handleListening = () => 
    console.log(`Listening on: ${PORT}`);


const server = app.listen(PORT,handleListening);
webSocket(server, app, session);