const hubspot = require("@hubspot/api-client");

exports.main = async (event, callback) => {
  const hubspotClient = new hubspot.Client({
    accessToken: process.env.WFTOKEN_PROD,
  });

  const { email } = event.inputFields;

  let phone;

  try {
    const apiResponse = await hubspotClient.crm.contacts.basicApi.getById(
      event.object.objectId,
      ["phone"],
    );

    phone = apiResponse.properties.phone;
    console.log("Fetched phone:", phone);
  } catch (err) {
    console.error("Error fetching contact:", err.response?.body || err);
    // HubSpot may retry automatically on certain errors; rethrow to fail the action.
    throw err;
  }

  callback({
    outputFields: {
      email,
      phone,
    },
  });
};

// ---------------- LOCAL TEST HARNESS ----------------
// This block runs ONLY when you execute the file directly (e.g. `node action.js`).
// It will NOT run when HubSpot loads your code, because HubSpot doesn't execute the file as the "main" module.
if (require.main === module) {
  require("dotenv").config();

  const payload = {
    origin: {
      portalId: 1,
      actionDefinitionId: 2,
    },
    object: {
      objectType: "CONTACT",
      objectId: 101,
    },
    inputFields: {
      email: "john.doe@gmail.com",
    },
    callbackId: "ap-123-456-7-8",
  };

  exports.main(payload, (result) => {
    console.log("Local callback result:", result);
  });
}
