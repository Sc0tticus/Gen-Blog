import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../../components/AppLayout/AppLayout";
import { useState } from "react";
import Markdown from "react-markdown";

export default function NewPost(props) {
  console.log("NEW POST PROPS");

  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  const [postContent, setPostContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

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
    setPostContent(json.postContent);
  };

  return (
    <div>
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
        >
          GENERATE
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
