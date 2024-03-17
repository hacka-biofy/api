import os = require("oci-objectstorage");
import common = require("oci-common");
import st = require("stream");
import { createReadStream, statSync } from "fs";
import { NodeFSBlob } from "oci-objectstorage";
// If using Node JS version >= 18, import the following package for working with streams
// import consumers from 'stream/consumers';

const compartmentId: string = 'ocid1.tenancy.oc1..aaaaaaaaw6v27cslg6eass6ghsad3p4lhmd7d4d6lilu4fra3svsr2dm26fa';
const bucket: string = 'test-bucket';
const object: string = 'temp.png';
const fileLocation: string = './images/temp.png';

const provider: common.ConfigFileAuthenticationDetailsProvider = new common.ConfigFileAuthenticationDetailsProvider();
const client = new os.ObjectStorageClient({ authenticationDetailsProvider: provider });

export async function handle() {
  try {
    const request: os.requests.GetNamespaceRequest = {};
    const response = await client.getNamespace(request);
    const namespace = response.value;

    await client.getBucket({
      namespaceName: namespace,
      bucketName: bucket
    });

    const stats = statSync(fileLocation);
    const nodeFsBlob = new NodeFSBlob(fileLocation, stats.size);
    const objectData = await nodeFsBlob.getData();

    const result = await client.putObject({
      namespaceName: namespace,
      bucketName: bucket,
      putObjectBody: objectData,
      objectName: object,
      contentLength: stats.size
    });

    console.log(JSON.stringify(result, null, 1))


    const getObjectResponse = await client.getObject({
      objectName: object,
      bucketName: bucket,
      namespaceName: namespace
    });

    console.log(JSON.stringify(getObjectResponse, null, 1))

    
  } catch (error) {
    console.log("Error executing example " + error);
  }
};

function compareStreams(stream1: any, stream2: any): boolean {
  return streamToString(stream1) === streamToString(stream2);
}

function streamToString(stream: any) {
  let output = "";
  stream.on("data", function(data: any) {
    output += data.toString();
  });
  stream.on("end", function() {
    return output;
  });
}

(async function() {
  console.log('comeeçççççouuuu')
  await handle();
})();