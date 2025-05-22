import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { OpenAIApi, Configuration } from "openai";
import clientPromise from "../../lib/mongodb";

export default withApiAuthRequired(async function handler(req, res) {
  const { user } = await getSession(req, res);

  console.log("Checking for OpenAI API key...");

  if (!process.env.OPENAI_API_KEY) {
    console.error("❌ OpenAI API key is missing!");
    return res.status(500).json({ error: "OpenAI API key is not configured" });
  }

  console.log("✅ OpenAI API key loaded.");

  const client = await clientPromise;
  const db = client.db("BlogStandard");

  const userProfile = await db.collection("users").findOne({
    auth0Id: user.sub,
  });

  if (!userProfile?.availableTokens) {
    console.log("❌ User has no available tokens");
    return res.status(403).json({
      error:
        "You have no available tokens. Please purchase more tokens to generate posts.",
    });
  }

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

    const seoResponse = await openai.createChatCompletion({
      model: "gpt-3.5-turbo-1106",
      messages: [
        {
          role: "system",
          content:
            "You are an SEO friendly blog post generator called BlogStandard. You are designed to ouput JSON. Do not include HTML tags in your output.",
        },
        {
          role: "user",
          content: `
            Generate an SEO friendly title and SEO friendly meta description for the following blog post.
            ${postContent}
            ---
            The output json must be in the following format:
            {
            "title": "example title",
            "metaDescription": "example meta description"
            }
          `,
        },
      ],
      response_format: { type: "json_object" },
    });

    const { title, metaDescription } =
      seoResponse.data.choices[0]?.message?.content || {};

    await db.collection("users").updateOne(
      {
        auth0Id: user.sub,
      },
      {
        $inc: {
          availableTokens: -1,
        },
      }
    );

    const post = await db.collection("posts").insertOne({
      postContent,
      title,
      metaDescription,
      topic,
      keywords,
      userId: userProfile._id,
      created: new Date(),
    });

    console.log("✅ Post generated successfully.", post);

    res.status(200).json({ postId: post.insertedId });
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
});
