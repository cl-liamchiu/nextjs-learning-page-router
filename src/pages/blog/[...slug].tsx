import React from "react";
import { useRouter } from "next/router";

const CatchAll: React.FC = () => {
  const router = useRouter();
  console.log("slug:", router.query.slug);
  return (
    <main style={{ padding: "2rem" }}>
      <h1>Catch-All Page</h1>
    </main>
  );
};

export default CatchAll;
