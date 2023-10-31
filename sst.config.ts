import { SSTConfig } from "sst";
import { MBSM } from "./stacks/MBSM";

export default {
  config(_input) {
    return {
      name: "mbsm",
      region: "us-east-1",
      profile: "snoozed",
    };
  },
  stacks(app) {
    app.stack(MBSM);
  },
} satisfies SSTConfig;
