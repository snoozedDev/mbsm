const setEnvTypes = async () => {
  console.log("Generating environment variables types...");

  const ignoredVars = ["NODE_ENV"];

  const fs = require("fs");
  const path = require("path");
  const envPath = path.join(__dirname, "..", "..", "..", "..", ".env");
  const envFile = fs.readFileSync(envPath, "utf8");
  const envLines = envFile.split("\n").filter((line: string) => line);
  const nonComments = envLines.filter((line: string) => !line.startsWith("#"));
  const nonIgnored = nonComments.filter(
    (line: string) => !ignoredVars.includes(line.split("=")[0])
  );
  const envVariables = nonIgnored.map((line: string) => line.split("=")[0]);
  const envTypesFile = `const envVariables = [
  ${envVariables.map((variable: string) => `"${variable}"`).join(",\n  ")},
] as const;

type EnvVariablesType = {
  [K in (typeof envVariables)[number]]: string;
};

export type EnvVariablesKeys = keyof EnvVariablesType;
`;
  const envTypesPath = path.join(__dirname, "..", "env.ts");
  fs.writeFileSync(envTypesPath, envTypesFile);
  console.log("Environment variables types set!");
};

setEnvTypes();
