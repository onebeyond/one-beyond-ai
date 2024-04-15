import 'dotenv/config'
const { ENV_PREFIX, STACK_NAME } = process.env;

export const getResourceName = (resourceName: string) => `${ENV_PREFIX}${STACK_NAME}${resourceName}`;