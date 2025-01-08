const express = require('express');
const app = express();
const PORT = 3000;

// Serve static files from the "public" folder
app.use(express.static('public'));

// Define a basic route
app.get('/', (req, res) => {
    res.send('Welcome to Moodiqa-Project!');
});

// Example additional route
app.get('/about', (req, res) => {
    res.send('This is the About page of Moodiqa-Project!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
