import axios from "axios";
import { withRetry } from "../utils/with-retry.js";

/**
 * Fetches emails from the Outlook account of the authenticated user.
 * @param accessToken The OAuth access token for the user.
 * @returns An array of emails fetched from Outlook.
 */
export async function fetchEmailsFromOutlook(
  accessToken: string
): Promise<any> {
  const emails = [];
  let url =
    "https://graph.microsoft.com/v1.0/me/messages?$select=subject,sender&$top=1000";

  while (url) {
    //hanlde rate limit
    const response = await withRetry(async () => {
      const result = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return result.data;
    });

    // Add the fetched emails to the list
    emails.push(...response.value);

    // Update the URL for the next iteration based on the response
    url = response["@odata.nextLink"] || "";
  }
  return emails;
}
