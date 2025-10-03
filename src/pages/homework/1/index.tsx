"use client";

import { useState } from "react";
import type { ChangeEvent } from "react";
import HomeworkLayout from "@/components/homework/homework-layout";
import HomeworkContent from "@/components/homework/homework-content";
import HomeworkDescription from "@/components/homework/homework-description";
import { HWData } from "@/lib/homework/1/data";
import styles from "./homework1.module.scss";

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
        <div className={styles.modeToggle}>
          <label className={styles.radioLabel}>
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
          <label className={styles.radioLabel}>
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
        <div className={styles.inputGroup}>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder={
              mode === "number" ? "Enter numbers only" : "Enter alphabets only"
            }
            className={styles.textInput}
          />
          <button
            onClick={() => setSubmittedValue(inputValue)}
            className={styles.submitButton}
          >
            Send
          </button>
        </div>
        {error && <div className={styles.errorMessage}>{error}</div>}
        {submittedValue && (
          <p className={styles.successMessage}>Welcome: {submittedValue}</p>
        )}
      </HomeworkContent>
    </HomeworkLayout>
  );
};

export default Homework1Page;
