"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export const UserPing = () => {
  const [error, setError] = useState(false);
  const [ping, setPing] = useState(0);

  const calculatePing = async () => {
    const start = Date.now();
    try {
      setError(false);
      await axios.get("/api/ping");
    } catch (e) {
      setError(true);
    }
    const end = Date.now();
    setPing(end - start);
  };

  useEffect(() => {
    calculatePing();
  }, []);

  return (
    <button disabled={ping > 0 && !error} onClick={calculatePing}>
      <span>{error ? "error" : ping}</span>
    </button>
  );
};
