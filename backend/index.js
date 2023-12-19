// index.js (Backend)

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5001;


app.use(cors());
app.use(express.json());

// MongoDB connection (replace with your MongoDB connection string)
mongoose.connect('mongodb://localhost:27017/yoga', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
  preferredBatch: String,
  paymentAmount: Number,
  registrationDate: { type: Date, default: Date.now },
  paymentStatus: { type: String, default: 'Pending' },
});

const User = mongoose.model('User', userSchema);

app.post('/api/submitForm', async (req, res) => {
  try {
    const { name, age, preferredBatch, paymentAmount, paymentStatus} = req.body;

    // Basic validation
    // if (!name || !age || !selectedBatch || !paymentAmount) {
    //     console.log(name, age, selectedBatch, paymentAmount)
    //   return res.status(400).json({ error: 'Please provide all required fields.' });
    // }

    if (!name){
        return res.status(400).json({error: 'Provide name'});
    }

    if (!age){
        return res.status(400).json({error: 'Provide age'});
    }

    if (!preferredBatch){
        return res.status(400).json({error: 'Provide preferredBatch'});
    }

    if (!paymentAmount){
        return res.status(400).json({error: 'Provide paymentAmount'});
    }

    // Create a new user
    const newUser = new User({
      name,
      age,
      preferredBatch,
      paymentAmount,
      paymentStatus,
    });

    // Save user to the database
    await newUser.save();

    // Mock payment function (replace with actual payment processing)
    const successfulPayment = await CompletePayment(newUser);
    console.log(successfulPayment);

    // Return success response
    res.json({ message: 'Form submitted successfully', user: newUser, successfulPayment });
  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mock payment function
async function CompletePayment(user) {
  // Perform payment processing logic here
  // For now, let's assume all payments are successful
  return true;
}



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
