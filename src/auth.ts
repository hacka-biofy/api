import * as identity from "oci-identity";
import common = require("oci-common");

const tenancy: string = "ocid1.tenancy.oc1..aaaaaaaaw6v27cslg6eass6ghsad3p4lhmd7d4d6lilu4fra3svsr2dm26fa";
const provider: common.ConfigFileAuthenticationDetailsProvider = new common.ConfigFileAuthenticationDetailsProvider();


(async () => {
  const client = new identity.IdentityClient({
    authenticationDetailsProvider: provider
  });

  const listUsersRequest = {
    compartmentId: tenancy
  };
  try {
    const listUsersResponse = await client.listUsers(listUsersRequest);
    console.log(listUsersResponse);
  } catch (err) {
    console.log(err);
  }
})();