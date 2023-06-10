import { COMMAND } from './command';
import { appStore } from './store';

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

- \`${COMMAND.GPT4}\` use gpt4 model
- \`${COMMAND.GPT3_5}\` use gpt-3-turbo model
- \`${COMMAND.CLEAR}\` clear history
- \`${COMMAND.HELP}\` show helper
`.trim();
}
