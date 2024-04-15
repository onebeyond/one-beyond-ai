# Welcome to your CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands locally

* `docker-compose up`    spin up localstack
* `npm install`    spin up localstack
* `npm install -g aws-cdk-local aws-cdk`    install cdk and cdklocal
* `pip install awscli-local`    install awslocal command
* `aws configure`    configure aws env locally - key: dummy, secret: dummy, region: eu-west-1, output: json
* `npm run watch`    watch for changes and compile
* `npm run test`     perform the jest unit tests
* `cdklocal bootstrap`  deploy this stack to your default AWS account/region locally
* `cdklocal diff`    compare deployed stack with current state
* `cdklocal deploy`  deploy this stack to your default AWS account/region
* `cdklocal synth`   emits the synthesized CloudFormation template
* `awslocal s3api put-bucket-notification-configuration --bucket announcements-bucket --notification-configuration file://event-config/announcement-s3-sns.json`    To connect s3 events to lambda handler
* `awslocal s3api put-object --bucket announcements-bucket --key test001.txt --body=test.txt`    To upload files to S3
* `aws logs describe-log-streams --log-group-name '/aws/lambda/localOneBeyondAIInfraAnnouncementFileUploadedEventHandler'`    Query lambda log streams
* `awslocal logs get-log-events --log-group-name '/aws/lambda/localOneBeyondAIInfraAnnouncementFileUploadedEventHandler' --log-stream-name '2024/04/09/[$LATEST]50482fc7a2a12e23715128fcfe2af71e'`    List logs from log stream
* `awslocal cloudformation delete-stack --stack-name localOneBeyondAIInfraStack` To delete a stack
* `awslocal cloudformation describe-stacks` To list stacks
* `awslocal sns publish --topic-arn arn:aws:sns:eu-west-1:000000000000:localOneBeyondAIInfraAnnouncementFileEventTopic --message=hellohello` To test sns publish

## Useful commands
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template
