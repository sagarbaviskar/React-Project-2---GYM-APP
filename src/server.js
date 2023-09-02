const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const { Configuration, OpenAIApi } = require("openai");

const config = new Configuration({
    // apiKey : "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"
    apiKey : "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"
})

const openai = new OpenAIApi(config)

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post("/chat", async (req, res) => {

    const { prompt } = req.body;

    const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        max_tokens: 512,
        temperature: 0
    });
    res.send(completion.data.choices[0].text);
});

const PORT = 8020;
app.listen(PORT, () => {
    console.log(`Server Running On Port :" ${PORT}`)
});



