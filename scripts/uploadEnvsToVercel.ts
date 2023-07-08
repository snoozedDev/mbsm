const main = async () => {
  console.log("Uploading environment variables to Vercel...");
  // get --token=value argument
  const tokenIndex = process.argv.findIndex((arg: string) =>
    arg.startsWith("--token=")
  );
  if (tokenIndex === -1) {
    console.log("No --token argument provided");
    return;
  }
  const vercelToken = process.argv[tokenIndex].split("=")[1];
  const fs = require("fs");
  const path = require("path");
  const envPath = path.join(__dirname, "..", ".env");
  const envFile = fs.readFileSync(envPath, "utf8");
  const envLines = envFile.split("\n").filter((line: string) => line);
  const nonComments = envLines.filter((line: string) => !line.startsWith("#"));
  const nonEmpty = nonComments.filter((line: string) => line.split("=")[1]);

  await Promise.all(
    nonEmpty.map(async (line: string) => {
      // execute
      const [key, value] = line.split("=");

      console.log(`Uploading ${key} to Vercel...`);
      const shell = require("shelljs");
      const command = `vercel env add ${key} ${value} --token ${vercelToken}`;
      const result = shell.exec(command);
      if (result.code !== 0) {
        console.log(`Error uploading ${key} to Vercel!`);
        console.log(result.stderr);
        return;
      } else {
        console.log(`${key} uploaded to Vercel!`);
      }

      // console.log(stdout);
      // // console.log(stderr);

      // if (stderr) {
      //   console.log(`Error uploading ${key} to Vercel!`);
      //   console.log(stderr.trim());
      //   return;
      // }

      // console.log(`${key} uploaded to Vercel!`);
    })
  );
};

main();
