import { esClient } from "../config/elasticsearchConfig.js";
import { fetchEmailsFromOutlook } from "../services/outlook.js";

const EMAIL_INDEX = "emails";

/**
 * Represents a user authentication manager for handling authentication-related operations.
 */
export class MailManager {
  private static instance: MailManager;

  /**
   * Gets the singleton instance of the MailManager.
   * @returns The singleton instance of MailManager
   */
  static getInstance(): MailManager {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new MailManager();
    return this.instance;
  }

  /**
   * Syncs emails from Outlook to Elasticsearch by fetching and storing them.
   * @param userId The ID of the user whose emails need to be synced.
   * @param accessToken The access token for authenticating with the Outlook API.
   */
  async syncEmails(userId: string, accessToken: string) {
    const emails = await fetchEmailsFromOutlook(accessToken);

    for (const email of emails) {
      await esClient.index({
        index: EMAIL_INDEX,
        id: email.id,
        body: {
          userId: userId,
          subject: email.subject,
          sender: email.sender.emailAddress.address,
        },
      });
    }
  }

  /**
   * Retrieves emails for a specific user from Elasticsearch.
   * @param userId The ID of the user whose emails are being fetched.
   * @returns An array of emails retrieved from Elasticsearch.
   */
  async getMails(userId: string): Promise<any[]> {
    try {
      const body = await esClient.search({
        index: EMAIL_INDEX,
        body: {
          query: {
            term: {
              "userId.keyword": userId,
            },
          },
        },
      });

      return body.hits.hits.map((hit: any) => hit._source);
    } catch (error) {
      console.error("Error retrieving emails:", error);
      throw new Error("Failed to retrieve emails");
    }
  }
}
