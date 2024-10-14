import { Client } from "@elastic/elasticsearch";
import dotenv from "dotenv";

dotenv.config();

//Initialize Elastic Search Client
export const esClient = new Client({
  node: process.env.ELASTICSEARCH_URL || "http://localhost:9200",
});
