const setEnvTypes = async () => {
  console.log("Generating environment variables types...");
  const fs = require("fs");
  const path = require("path");
  const envPath = path.join(__dirname, "..", ".env");
  const envFile = fs.readFileSync(envPath, "utf8");
  const envLines = envFile.split("\n").filter((line: string) => line);
  const envVariables = envLines.map((line: string) => line.split("=")[0]);
  const envTypes = envVariables.map((variable: string) => {
    return `${variable}: string;`;
  });
  const envTypesFile = `const envVariables = [
  ${envVariables.map((variable: string) => `"${variable}"`).join(",\n  ")},
] as const;

type EnvVariablesType = {
  [K in (typeof envVariables)[number]]: string;
};

declare global {
  namespace NodeJS {
    interface ProcessEnv extends EnvVariablesType {}
  }
}
`;
  const envTypesPath = path.join(__dirname, "..", "src", "types", "env.d.ts");
  fs.writeFileSync(envTypesPath, envTypesFile);
  console.log("Environment variables types set!");
};

setEnvTypes();
