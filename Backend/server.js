const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URL, {
    
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));


// Default route
app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

//routes

const EngPoliRoutes = require('./routes/engPolisymousWordsroute');
const SinPoliRoutes = require('./routes/sinPolisymousWordsroute')



//API middleware
app.use(EngPoliRoutes);
app.use(SinPoliRoutes);