import { validateLocalAuthKey } from './auth';
import { COMMAND } from './command';
import { appStore } from './store';
import { GPT_MODEL } from '../config';

export function generateStartMsg() {
  return `
### Welcome to use ${appStore.model}.

${generateHelpMsg()}

${
  validateLocalAuthKey()
    ? ''
    : '**Since API calls are chargeable, for temporary internal use only, please enter your activation code.**\n'
}
`.trim();
}

export function generateHelpMsg() {
  return `
Commands:

- \`${COMMAND.GPT4}\` use ${GPT_MODEL.GPT4} model
- \`${COMMAND.GPT3_5}\` use ${GPT_MODEL.GPT3_5} model
- \`${COMMAND.CLEAR}\` clear history
- \`${COMMAND.ISSUE}\` report issue
- \`${COMMAND.HELP}\` show helper
`.trim();
}
