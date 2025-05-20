import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../../components/AppLayout/AppLayout";
import { useState } from "react";
import Markdown from "react-markdown";

export default function NewPost(props) {
  const [postContent, setPostContent] = useState("");

  console.log("NEW POST PROPS");

  const handleClick = async () => {
    const response = await fetch(`/api/generatePost`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        topic: "dog ownership",
        keywords: "first-time dog owner, puppy diet",
      }),
    });
    const json = await response.json();
    console.log("RESULT", json);
    setPostContent(json.postContent);
  };

  return (
    <div>
      <h1>this is the new post page</h1>
      <button className="btn" onClick={handleClick}>
        Generate
      </button>
      <Markdown>{postContent}</Markdown>
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
