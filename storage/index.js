const authMiddleware = require("../auth");
const uuid = require("uuid");
const s3 = require("@aws-sdk/client-s3");

const s3Client = new s3.S3Client({region: 'us-west-2'});
const bucketName = 'life-line-upload-assets';
const bucketUrlPrefix = 'https://life-line-upload-assets.s3.us-west-2.amazonaws.com';

async function storePhoto(file) {
    const ext = file.originalname.split('.').pop();
    const key = uuid.v4() + '.' + ext;

await s3Client.send(new s3.PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        ContentType: file.mimetype,
        Body: file.buffer,
    }));
    return `${bucketUrlPrefix}/${key}`;
}

module.exports = {storePhoto};