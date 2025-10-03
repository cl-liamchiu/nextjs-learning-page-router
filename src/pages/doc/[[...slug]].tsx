import React from "react";
import { useRouter } from "next/router";

const OptionalCatchAll: React.FC = () => {
  const router = useRouter();
  console.log("slug:", router.query.slug);

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Optional Catch-All Page</h1>
    </main>
  );
};

export default OptionalCatchAll;
