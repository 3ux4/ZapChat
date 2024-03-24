const express = require('express');
const http = require('http');
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');
const { Server } = require("socket.io");

// leave these for XSS protection
const { JSDOM } = require('jsdom');
const window = new JSDOM('').window;
const createDOMPurify = require('dompurify');
const DOMPurify = createDOMPurify(window);

function renderPostContentWithHashtags(content) {
    // Check if content is null or undefined
    if (content === null || content === undefined) {
        return ''; // Return an empty string or handle the null content case appropriately
    }

    // Implement the logic to replace hashtags with clickable links
    const returnable = content.replace(/#(\w+)/g, '<a href="/hash/$1" class="hashtag">#$1</a>');
    return sanitizeAndRender(returnable);
}

function sanitizeAndRender(text) {
    const sanitizedHTML = DOMPurify.sanitize(text);
    return sanitizedHTML;
}

// kickstart express
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = process.env.port || 8000;
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Cache-Control", "no-cache");
    next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// listen to app
server.listen(port, function(){
    console.log('Ready to Hy some Draulisc! Port: ' + port);
})

const messages = []; // Initialize messages array

// Handle WebSocket connections
io.on('connection', (socket) => {

    // Emit current messages to the newly connected client
    socket.emit('currentMessages', messages);

    // Listen for new messages from clients
    socket.on('sendMessage', (data) => {
        const { username, messageText } = data;
        const cleanMessageText = renderPostContentWithHashtags(messageText);
        const newMessage = {
            username: username,
            message: cleanMessageText
        };
        // Add the new message object to the messages array
        messages.push(newMessage);
        // If the number of messages exceeds the maximum allowed, remove the oldest message(s)
        const maxMessages = 5;
        while (messages.length > maxMessages) {
            messages.shift(); // Remove the oldest message from the beginning of the array
        }
        // Broadcast the new message to all connected clients
        io.emit('newMessage', newMessage);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        return;
    });
});

app.get('/', async (req, res) => {
    const sessionId = uuidv4(); // Generate a new sessionId
    res.render('pages/landing', {
        username: sessionId
    });
});


app.get('/chat', async (req, res) => {
    const sessionId = uuidv4(); // Generate a new sessionId
    res.render('pages/index', {
        messages: messages,
        username: sessionId,
    })
});