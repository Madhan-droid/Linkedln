// Bad:
exports.handler = async (event) => {
  // ❌ BAD: new S3 client every single invocation
  const AWS = require("aws-sdk");
  const s3 = new AWS.S3();

  const data = await s3
    .getObject({
      Bucket: "my-bucket",
      Key: "file.txt",
    })
    .promise();

  return data.Body.toString();
};
// What’s wrong?
// AWS clients are heavy objects
// Creating inside the handler slows down every execution
// Wastes execution time = higher cost

// ====================================================================================================================

// Good:
// 🟢 Create once — reused across Lambda invocations
const AWS = require("@aws-sdk/client-s3");
const s3 = new AWS.S3Client({});

exports.handler = async (event) => {
  const command = new AWS.GetObjectCommand({
    Bucket: "my-bucket",
    Key: "file.txt",
  });

  const data = await s3.send(command);

  return "OK";
};

// Benefits:
// AWS client reused across calls
// Very fast warm-start performance
// Smaller execution time
