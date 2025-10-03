import React from "react";
import { useRouter } from "next/router";

const DynamicPage: React.FC = () => {
  const router = useRouter();
  console.log("slug:", router.query.slug);

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Dynamic Page: {router.query.slug}</h1>
    </main>
  );
};

export default DynamicPage;
