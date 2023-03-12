import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const person = req.body.person || '';
  const giftOne = req.body.giftOne || '';
  const giftTwo = req.body.giftTwo || '';
  const giftThree = req.body.giftThree || '';
  if (person.trim().length === 0 || giftOne.trim().length === 0 || giftTwo.trim().length === 0 || giftThree.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid person and sample gifts",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(person, giftOne, giftTwo, giftThree),
      temperature: 1.0,
      max_tokens: 1000,
    });
    console.log(completion.data.choices[0].text);
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(person, giftOne, giftTwo, giftThree) {
  const capitalizedPerson =
    person[0].toUpperCase() + person.slice(1).toLowerCase();
  const prompt = `Using the Previous Gifts as examples, suggest three more possible Christmas gifts for each person. The Gift Suggestions should be related to the Previous Gifts in some way. The Gift Suggestions should also be similar in price range to the Previous Gifts.

  Person: Son.
  Previous Gifts:
  1. A Play Station console.
  2. Tickets to a Boston Red Sox game.
  3. A new skateboard.

  Gift Suggestions:
  1. Call of Duty Modern Warfare game.
  2. A signed David Ortiz jersey.
  3. A longboard.

  Person: Mother.
  Previous Gifts:
  1. A digital picture frame which lets you upload pictures from an app.
  2. A self-heating coffee mug.
  3. A luxury bathrobe.

  Gift Suggestions:
  1. A customized photo book with family photos.
  2. A Nespresso coffee maker.
  3. A wine tasting class.

  Person: ${capitalizedPerson}.
  Previous Gifts:
  1. ${giftOne}.
  2. ${giftTwo}.
  3. ${giftThree}.

  Gift Suggestions:
  `;
  console.log(prompt);
  return prompt;
}
