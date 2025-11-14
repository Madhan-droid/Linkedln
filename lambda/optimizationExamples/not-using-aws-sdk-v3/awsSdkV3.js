// BAD Practice — Using AWS SDK v2 (Heavy, slow cold starts)
// ❌ AWS SDK v2 (big bundle, slower cold start)
const AWS = require("aws-sdk");

exports.handler = async (event) => {
    const s3 = new AWS.S3(); // recreated every time
    const result = await s3
        .getObject({ Bucket: "my-bucket", Key: "data.json" })
        .promise();

    return result.Body.toString();
};

// ❗ Why this is BAD?
// AWS SDK v2 loads entire service modules → heavy
// Adds 3–5 MB to your Lambda bundle
// Slower cold starts
// More memory usage
// Reinitializes clients each time unless hoisted

//====================================================================================================================


//GOOD Practice — AWS SDK v3 (Modular, tree-shakeable)
// 🟢 AWS SDK v3 (modular, lightweight)
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");

// Client created ONCE, reused between Lambda invocations
const s3 = new S3Client({});

exports.handler = async (event) => {
    const command = new GetObjectCommand({
        Bucket: "my-bucket",
        Key: "data.json"
    });

    const result = await s3.send(command);

    return "OK";
};

// Why this is GOOD?
// Only imports the ** exact methods you use**
// Bundle size reduced by 70%–90%
// Much faster cold starts
// Better tree-shaking with bundlers (esbuild, webpack, SWC)
// Cleaner structure for multi-service Lambdas