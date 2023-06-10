import { COMMAND } from './command';
import { appStore } from './store';
import { GPT_MODEL } from '../config';

export function generateValidateMsg() {
  return `Please enter your activation code.`.trim();
}

export function generateStartMsg() {
  return `
### Welcome to use ${appStore.model}.

${generateHelpMsg()}
`.trim();
}

export function generateHelpMsg() {
  return `
Commands:

- \`${COMMAND.GPT4}\` use ${GPT_MODEL.GPT4} model
- \`${COMMAND.GPT3_5}\` use ${GPT_MODEL.GPT3_5} model
- \`${COMMAND.CLEAR}\` clear history
- \`${COMMAND.HELP}\` show helper
`.trim();
}
