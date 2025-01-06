import { Configuration, OpenAIApi } from "openai";

// Check if the API key exists
if (!process.env.REACT_APP_OPENAI_API_KEY) {
  throw new Error("Missing OpenAI API Key. Please set REACT_APP_OPENAI_API_KEY in your environment variables.");
}

// OpenAI Configuration
const configuration = new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY, // Secure API key
});
const openai = new OpenAIApi(configuration);

// Analyze Text Function
export const analyzeText = async (text) => {
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-4o-mini", // Ensure this is the correct model name, "gpt-4o-mini" might be invalid
      messages: [
        {
          role: "system",
          content:
            "You are an AI that categorizes and analyzes project report text without truncating any content.",
        },
        {
          role: "user",
          content: `Analyze the following project report text and return it as structured JSON with:
          - Title
          - Subtitle (if present)
          - Detailed author information (Name, Course, Date)
          - Sections with headings, subheadings, and content.
          
          Return only valid JSON without any additional explanations or text.\n\n${text}`,
        },
      ],
      max_tokens: 1500,
      temperature: 0.3,
    });

    let rawResponse = response.data.choices[0].message.content.trim();
    console.log("Raw Response from API:", rawResponse);

    // Clean up response to remove code block markers
    rawResponse = rawResponse.replace(/```json/g, "").replace(/```/g, "").trim();

    // Parse cleaned JSON
    let cleanedJSON;
    try {
      cleanedJSON = JSON.parse(rawResponse); // Attempt to parse directly
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

// Parsing Function
export const parseStructuredText = (structuredJSON) => {
  if (typeof structuredJSON !== "object" || structuredJSON === null) {
    throw new Error("Expected JSON object but received invalid data.");
  }

  const { Title, Subtitle, Author, Sections } = structuredJSON;

  const formattedResult = {
    title: Title || "Untitled",
    subtitle: Subtitle || "No subtitle provided",
    authors: Author
      ? {
          name: Author.Name || "Unknown",
          course: Author.Course || "N/A",
          date: Author.Date || "N/A",
        }
      : null,
    sections: Sections || [],
  };

  return formattedResult;
};
