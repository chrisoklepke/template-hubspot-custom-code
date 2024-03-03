require("dotenv").config();
const hubspot = require("@hubspot/api-client");

exports.main = async (event, callback) => {
  const hubspotClient = new hubspot.Client({
    accessToken: process.env.WFTOKEN_PROD,
  });

  const { email } = event.inputFields;

  let phone;

  try {
    const ApiResponse = await hubspotClient.crm.contacts.basicApi.getById(
      event.object.objectId,
      ["phone"],
    );
    phone = ApiResponse.properties.phone;
    console.log(phone)
  } catch (err) {
    console.error(err);
    // We will automatically retry when the code fails because of a rate limiting error from the HubSpot API.
    throw err;
  }

  callback({
    outputFields: {
      email,
      phone,
    },
  });
};

const payload = {
  origin: {
    // Your portal ID
    portalId: 1,

    // Your custom action definition ID
    actionDefinitionId: 2,
  },
  object: {
    // The type of CRM object that is enrolled in the workflow
    objectType: "CONTACT",

    // The ID of the CRM object that is enrolled in the workflow
    objectId: 101,
  },
  inputFields: {
    // The property name for defined inputs
    email: "john.doe@gmail.com",
  },
  // A unique ID for this execution
  callbackId: "ap-123-456-7-8",
};

exports.main(payload, (result) => console.log(result));
