const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// 👉 এখানে তোমার MongoDB URI বসাও
mongoose.connect("mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/milDB")
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

// Schema
const MemberSchema = new mongoose.Schema({
    name: String,
    fineMeals: Number,
    presentMeals: Number,
    presentExtra: Number,
    guestMeals: Number,
    deposit: Number,
    paid: Boolean
});

const Member = mongoose.model("Member", MemberSchema);

// Save API
app.post("/saveMembers", async (req, res) => {
    await Member.deleteMany({});
    await Member.insertMany(req.body);
    res.send("Saved Successfully");
});

// Get API
app.get("/members", async (req, res) => {
    const data = await Member.find();
    res.json(data);
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
