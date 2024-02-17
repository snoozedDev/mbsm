"use client";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export const ConvexTest = () => {
  const test = useQuery(api.test.test.getTest);

  return (
    <div>
      {JSON.stringify(test)}
      <h1>Welcome to convex-test!</h1>
    </div>
  );
};
