//

import tasks from "./cron-tasks";

//

export default ({ env }) => ({
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1337),
  // url: env("URL", "http://localhost:4000"),
  app: {
    keys: env.array("APP_KEYS"),
  },
  webhooks: {
    populateRelations: env.bool("WEBHOOKS_POPULATE_RELATIONS", false),
  },

  //

  cron: {
    enabled: true,
    tasks,
  },
});
