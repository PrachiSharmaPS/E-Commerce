const express = require("express")
const mongoose = require("mongoose")
const route = require("./src/routes/route")
const multer = require("multer");

const app = express()

app.use(express.json())
app.use(multer().any())

mongoose.connect("mongodb+srv://group22:1234@group22databse.uvtoalh.mongodb.net/group9Database",
    { useNewUrlParser: true }, mongoose.set('strictQuery', false))

    .then(() => console.log("MongoDb is connected"))
    .catch((err) => console.log(err))

app.use("/", route)

app.use((req, res) => {
    return res.status(400).send({ status: false, message: "End point is incorrect" })
});


const PORT = 3000

app.listen(PORT, () => {
    console.log(`Express app is running on port ${PORT}`)
})
