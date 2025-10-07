import { FormEvent, useState } from "react";

export default function Page() {
  const [id, setId] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Object.fromEntries(formData)),
    });

    // Handle response if necessary
    const data = await response.json();
    console.log("Response from server:", data);
    setId(data.id);
  }

  return (
    <form onSubmit={onSubmit}>
      <input type="text" name="name" />
      <button type="submit">Submit</button>
      {id && <div>Submitted ID: {id}</div>}
    </form>
  );
}
