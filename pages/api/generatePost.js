import { OpenAIApi, Configuration } from "openai";

export default async function handler(req, res) {
  console.log("Checking for OpenAI API key...");
  if (!process.env.OPENAI_API_KEY) {
    console.error("❌ OpenAI API key is missing!");
    return res.status(500).json({ error: "OpenAI API key is not configured" });
  }

  console.log("✅ OpenAI API key loaded.");

  const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(config);

  const { topic, keywords } = req.body;

  console.log("📨 Received request to generate post.");
  console.log("➡️ Topic:", topic);
  console.log("➡️ Keywords:", keywords);

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo-1106",
      messages: [
        {
          role: "system",
          content:
            "You are an SEO friendly blog post generator called BlogStandard. You are designed to ouput markdown without frontmatter.",
        },
        {
          role: "user",
          content: `
          Generate me a long and detailed SEO friendly blog post on the following topic delimited by triple hyphens:
          ---
          ${topic}
          ---
          Targeting the following keywords delimited by triple hyphens:
          ---
          ${keywords}
          ---
          `,
        },
      ],
    });

    const postContent = response.data.choices[0]?.message?.content || "";

    console.log("✅ Post generated successfully.");
    res.status(200).json({ postContent });
  } catch (error) {
    console.error("❌ Error generating post:", error);

    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }

    res.status(500).json({
      error: "Failed to generate post",
      details: error.message,
    });
  }
}
