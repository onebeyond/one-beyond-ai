cdklocal bootstrap
cdklocal deploy
awslocal s3api put-bucket-notification-configuration --bucket file-bucket --notification-configuration file://event-config/events.json