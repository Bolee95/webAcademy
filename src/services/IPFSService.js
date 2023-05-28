import { S3 } from "aws-sdk";
import axios from "axios";

const s3 = new S3({
  // DONT HOLD THESE ON FRONTEND
  accessKeyId: "00FE333411E074CEDC54",
  secretAccessKey: "djNIzD3koIjhhtB14xvTgiE0nbz4UjxCC9gs2TvI",
  endpoint: "https://s3.filebase.com",
  region: "us-east-1",
  signatureVersion: "v4",
});

export async function uploadJSON(name, jsonData, onUploaded) {
  const request = s3.putObject({
    Bucket: "web25bucket",
    Key: name,
    Body: JSON.stringify(jsonData),
    ContentType: "application/json; charset=utf-8",
  });

  // Returns CID trough response headers
  request.on("httpHeaders", (_, headers) => {
    onUploaded(headers["x-amz-meta-cid"]);
  });

  request.on("error", (error) => {
    console.error(error);
  });

  request.send();
}

export async function getMetadata(url) {
  const response = await axios.get(url);
  return response.data;
}
