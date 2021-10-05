const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const config = require('config');
const errorHandler = require('./middleware/Error/errorHandler');



//middleware
app.use(express.json({limit: '30mb', extended: true}));
app.use(express.urlencoded({limit: '30mb', extended: true}));
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
app.use('/subs', require('./routes/subs'));

//error handler
app.use(errorHandler);

//serve static assets if production
if(process.env.NODE_ENV === 'production'){
    //set static folder
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    })
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));