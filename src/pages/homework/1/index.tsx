"use client";

import { useState } from "react";
import type { ChangeEvent } from "react";
import HomeworkLayout from "@/components/homework/homework-layout";
import HomeworkContent from "@/components/homework/homework-content";
import HomeworkDescription from "@/components/homework/homework-description";
import { HWData } from "@/lib/homework/1/data";

const Homework1Page = () => {
  const [mode, setMode] = useState<"number" | "alpha">("number");
  const [inputValue, setInputValue] = useState("");
  const [submittedValue, setSubmittedValue] = useState("");
  const [error, setError] = useState("");

  const numberRegex = /^\d*$/;
  const alphaRegex = /^[a-zA-Z]*$/;

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (mode === "number") {
      if (numberRegex.test(value)) {
        setInputValue(value);
        setError("");
      } else {
        setError("Only numbers are allowed.");
      }
    } else {
      if (alphaRegex.test(value)) {
        setInputValue(value);
        setError("");
      } else {
        setError("Only alphabets are allowed.");
      }
    }
  };

  return (
    <HomeworkLayout>
      <HomeworkContent>
        <HomeworkDescription {...HWData} />
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={mode === "number"}
              onChange={() => {
                setInputValue("");
                setSubmittedValue("");
                setMode("number");
              }}
            />
            Only Numbers
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={mode === "alpha"}
              onChange={() => {
                setInputValue("");
                setSubmittedValue("");
                setMode("alpha");
              }}
            />
            Only Alphabets
          </label>
        </div>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder={
              mode === "number" ? "Enter numbers only" : "Enter alphabets only"
            }
            className="w-full max-w-xs rounded border border-gray-300 p-2"
          />
          <button
            onClick={() => setSubmittedValue(inputValue)}
            className="w-full max-w-xs rounded bg-blue-500 p-2 text-white transition-colors hover:bg-blue-600 sm:w-auto"
          >
            Send
          </button>
        </div>
        {error && <div className="text-center text-red-500">{error}</div>}
        {submittedValue && (
          <p className="text-center text-green-600">
            Welcome: {submittedValue}
          </p>
        )}
      </HomeworkContent>
    </HomeworkLayout>
  );
};

export default Homework1Page;
