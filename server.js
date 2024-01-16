const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 3000;

// Connect to MongoDB database
mongoose.connect(
  "mongodb+srv://zhuchenyu0214:zcy6347pipi@cluster0.kdhisoz.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Define the database schema
const appointmentSchema = new mongoose.Schema({
  title: String,
  start: Date,
  fullName: String,
  email: String,
  phoneNumber: String,
});

// Create a model based on the schema
const Appointment = mongoose.model('Appointment', appointmentSchema);

// Middleware configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static('public'));

// Routes
app.post('/appointments', async (req, res) => {
  const { title, start, fullName, email, phoneNumber } = req.body;
  const appointment = new Appointment({ title, start, fullName, email, phoneNumber });

  try {
    await appointment.save();
    res.status(201).send(appointment);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get('/appointments', async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.send(appointments);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.delete('/appointments/:id', async (req, res) => {
  const appointmentId = req.params.id;

  try {
    const deletedAppointment = await Appointment.findByIdAndDelete(appointmentId);

    if (!deletedAppointment) {
      return res.status(404).send({ error: 'Appointment not found' });
    }

    res.send(deletedAppointment);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


