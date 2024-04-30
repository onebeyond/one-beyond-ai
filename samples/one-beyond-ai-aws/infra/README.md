# Welcome to your CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands locally

* `docker-compose up`    spin up localstack
* `npm install`    spin up localstack
* `npm install -g aws-cdk-local aws-cdk`    install cdk and cdklocal
* `pip install awscli-local`    install awslocal command
* `aws configure`    configure aws env locally - key: fake, secret: fake, region: eu-west-1, output: json
* `npm run watch`    watch for changes and compile
* `npm run test`     perform the jest unit tests
* `cdklocal bootstrap`  deploy this stack to your default AWS account/region locally
* `cdklocal diff`    compare deployed stack with current state
* `cdklocal deploy`  deploy this stack to your default AWS account/region
* `cdklocal synth`   emits the synthesized CloudFormation template
* `awslocal s3api put-bucket-notification-configuration --bucket file-bucket --notification-configuration file://event-config/events.json`    To connect s3 events to lambda handler
* `awslocal s3api put-object --bucket file-bucket --key test001.txt --body=test.txt`    To upload files to S3
* `aws logs describe-log-streams --log-group-name '/aws/lambda/localOneBeyondAIInfraFileUploadedEventHandler'`    Query lambda log streams
* `awslocal logs get-log-events --log-group-name '/aws/lambda/localOneBeyondAIInfraFileUploadedEventHandler' --log-stream-name '2024/04/09/[$LATEST]50482fc7a2a12e23715128fcfe2af71e'`    List logs from log stream
* `awslocal logs delete-log-stream --log-group-name '/aws/lambda/localOneBeyondAIInfraFileUploadedEventHandler' --log-stream-name '2024/04/16/[$LATEST]400e6b72bc9a7580648115fd8b626765'`    Delete a log stream
* `awslocal cloudformation delete-stack --stack-name localOneBeyondAIInfraStack` To delete a stack
* `awslocal cloudformation describe-stacks` To list stacks
* `awslocal sns publish --topic-arn arn:aws:sns:eu-west-1:000000000000:localOneBeyondAIInfraFilePutEventTopic --message=hellohello` To test sns publish
* `docker network create elastic` to create elastic docker network
* `docker pull docker.elastic.co/elasticsearch/elasticsearch:8.13.2` to pull elasticsearch docker image
* `docker run --name elasticsearch --net elastic -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" -t docker.elastic.co/elasticsearch/elasticsearch:8.13.2` to run the elastic container
* `docker pull docker.elastic.co/kibana/kibana:8.13.2` to pull kibana
* `docker run --name kibana --net elastic -p 5601:5601 docker.elastic.co/kibana/kibana:8.13.2` to run kibana
* `npx ts-node ./scripts/create-elastic-index.ts` to create your elastic index

## Useful commands
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template
