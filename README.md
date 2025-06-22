# Serverless Deployment Steps

- Make sure to choose `lambda.handler` in Lambda function instead of `index.handler`.

```sh
npm install --omit=dev
zip -r devtinder-api.zip . -x "*.git*" "*.env*"
aws lambda update-function-code --function-name devtinder-api --zip-file fileb://devtinder-api.zip
```
