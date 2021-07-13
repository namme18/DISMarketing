const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const config = require('config');



//middleware
app.use(express.json());
app.use(cors());

const db = config.get('mongoURI');

mongoose
    .connect(db, {
         useCreateIndex: true,
         useNewUrlParser: true,
         useUnifiedTopology: true
    })
    .then(() => console.log('mongoDb connected...'))
    .catch(err => console.log(err));

app.use('/auth', require('./routes/user'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));