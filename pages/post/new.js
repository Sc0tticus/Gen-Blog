import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../../components/AppLayout/AppLayout";
import { useState } from "react";
import Markdown from "react-markdown";

export default function NewPost(props) {
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  const [postContent, setPostContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    setError("");

    try {
      const response = await fetch(`/api/generatePost`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic,
          keywords,
        }),
      });

      const json = await response.json();
      console.log("RESULT", json);

      if (!response.ok) {
        setError(json.error || "Failed to generate post");
        setPostContent("");
      } else {
        setPostContent(json.postContent);
      }
    } catch (err) {
      console.error("Error generating post:", err);
      setError(
        "An error occurred while generating the post. Please try again."
      );
      setPostContent("");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            <strong>Generate a blog post on the topic of:</strong>
          </label>
          <textarea
            className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>
        <div>
          <label>
            <strong>Targeting the following keywords:</strong>
          </label>
          <textarea
            className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="btn bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mt-4"
          disabled={isGenerating}
        >
          {isGenerating ? "GENERATING..." : "GENERATE"}
        </button>
      </form>
      <div className="mt-4">
        <Markdown>{postContent}</Markdown>
      </div>
    </div>
  );
}

NewPost.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired(() => {
  return {
    props: {
      test: "this is a test",
    },
  };
});
