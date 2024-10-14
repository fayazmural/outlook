import { esClient } from "../config/elasticsearchConfig.js";

(async () => {
  const userIndexExists = await esClient.indices.exists({ index: "users" });
  const emailIndexExists = await esClient.indices.exists({ index: "emails" });

  if (!userIndexExists) {
    await esClient.indices.create({ index: "users" });
    console.log("Elasticsearch users index created");
  } else {
    console.log("Elasticsearch users index already exists");
  }

  if (!emailIndexExists) {
    await esClient.indices.create({ index: "emails" });
    console.log("Elasticsearch emails index created");
  } else {
    console.log("Elasticsearch emails index already exists");
  }
})();
