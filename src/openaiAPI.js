// openaiAPI.js
import { Configuration, OpenAIApi } from "openai";

// Ensure the API key is set in your environment
if (!process.env.REACT_APP_OPENAI_API_KEY) {
  throw new Error("Missing OpenAI API Key. Please set REACT_APP_OPENAI_API_KEY in your environment variables.");
}

const configuration = new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

/**
 * Analyzes raw text using GPT and returns structured JSON.
 * The prompt instructs GPT to include bullet points (as an array) if applicable.
 */
export const analyzeText = async (text) => {
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-4", // Update the model name as needed
      messages: [
        {
          role: "system",
          content:
            "You are an AI that categorizes and analyzes project report text without truncating any content. If there are lists in the content, please include them as a 'BulletPoints' array.",
        },
        {
          role: "user",
          content: `Analyze the following project report text and return it as structured JSON with the following keys:
- Title
- Subtitle (if present)
- Detailed author information (Name, Course, Date)
- Sections: Each section should have a "Heading", optional "Content", an optional "BulletPoints" array if there are any list items, and optional "Subsections" (which have a "Subheading", optional "Content", and optional "BulletPoints" array).
An example of bullet points is: Aristotle made significant contributions to many fields, including metaphysics, ethics, logic, and natural sciences. He developed the concept of the "Golden Mean," advocating for moderation between extremes as the key to virtuous living. Aristotle's idea of "substance" became a cornerstone in metaphysical theory, focusing on the nature of being and existence. He established formal logic, creating syllogisms to evaluate arguments based on deductive reasoning. His works on biology laid the foundation for the study of living organisms, emphasizing empirical observation and classification.
Here the text must be divided into 5 bullet points to make sense. Only use bullet points where absolutely necessary!
Return only valid JSON without any additional explanations or text.\n\n${text}`,
        },
      ],
      max_tokens: 2000,
      temperature: 0.3,
    });

    let rawResponse = response.data.choices[0].message.content.trim();
    console.log("Raw Response from API:", rawResponse);

    // Remove code block markers if present.
    rawResponse = rawResponse.replace(/```json/g, "").replace(/```/g, "").trim();

    // Parse the JSON.
    let cleanedJSON;
    try {
      cleanedJSON = JSON.parse(rawResponse);
      console.log("Cleaned JSON:", cleanedJSON);
    } catch (parseError) {
      console.error("Error parsing response JSON:", parseError);
      throw new Error("Failed to parse the JSON response. Please try again.");
    }

    return cleanedJSON;
  } catch (error) {
    console.error("Error calling OpenAI API:", error.response?.data || error.message);
    throw new Error("Failed to analyze text. Please try again.");
  }
};

/**
 * Parses the structured JSON returned by GPT.
 * Converts single author objects into an array and ensures all keys exist.
 * Now checks for both "AuthorInformation" and "Author" keys.
 */
export const parseStructuredText = (structuredJSON) => {
  if (typeof structuredJSON !== "object" || structuredJSON === null) {
    throw new Error("Expected JSON object but received invalid data.");
  }

  // Destructure possible keys.
  const { Title, Subtitle, AuthorInformation, Author, Sections } = structuredJSON;

  // Prefer "AuthorInformation" if present; otherwise fallback to "Author".
  let authorsArray = [];
  if (AuthorInformation) {
    authorsArray = Array.isArray(AuthorInformation) ? AuthorInformation : [AuthorInformation];
  } else if (Author) {
    authorsArray = Array.isArray(Author) ? Author : [Author];
  }

  const formattedResult = {
    title: Title || "Untitled",
    subtitle: Subtitle || "",
    authors: authorsArray,
    sections: Sections || [],
  };

  console.log("Structured Data:", formattedResult);
  return formattedResult;
};
