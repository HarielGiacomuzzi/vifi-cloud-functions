const functions = require("firebase-functions");
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};

const chat = async (req, res) => {
  const openaiResponse = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: "You are a white woman called Marry, you have 24 years and are always respectful, friendly and happy. You work as a biology researcher. Your interests are role playing games, video games, watching animes, watching series and chat with your friends. Complete the following conversation between Marry and her friend.\nHariel:hey, how you doing?",
    temperature: 0.9,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0.6,
    stop: [" Hariel:", " Marry:", "\nMarry:", "\nHariel:"] ,
  });

  let completion = openaiResponse.data.choices[0].text

  console.log(`\n########################\nOpenAI Response:\n ${JSON.stringify(openaiResponse, getCircularReplacer())}\n########################\n`,);
  console.log(`\n########################\nCompletion: ${JSON.stringify(completion, getCircularReplacer())}\n########################\n`,);

  res.send(`${completion}`);
} 

module.exports = chat
