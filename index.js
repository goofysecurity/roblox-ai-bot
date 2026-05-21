import express from "express";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

app.post("/chat", (req, res) => {
    const message = req.body.message;

    res.json({
        reply: "AI says: " + message
    });
});

app.listen(process.env.PORT || 3000, "0.0.0.0", () => {
    console.log("Server running on port 3000");
});
