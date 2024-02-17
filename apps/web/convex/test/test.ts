import { query } from "../_generated/server";

export const getTest = query({
  args: {},
  handler: async (cts, arg) => {
    console.log({ cts, arg });

    const auth = await cts.auth.getUserIdentity();
    console.log({ auth });
    return "Hello, Worsdfld!";
  },
});
