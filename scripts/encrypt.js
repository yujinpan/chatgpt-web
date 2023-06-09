/* eslint-env node */

const CryptoJS = require('crypto-js');
const { readFileSync, writeFileSync } = require('fs');
const { resolve } = require('path');

const env = resolve(__dirname, '../.env.local');

require('dotenv').config({
  path: env,
});

encodeEnv();

function encodeEnv() {
  let envContent = readFileSync(env).toString();

  ['VITE_APP_SECRET_O', 'VITE_APP_AUTH_KEY_O'].forEach((key) => {
    const replaceKey = key.replace('_O', '');
    const replaceContent = encodeKey(process.env[key]);

    envContent = envContent.replace(
      new RegExp(`${replaceKey}=[^\n]*`),
      `${replaceKey}=${replaceContent}`,
    );

    // eslint-disable-next-line no-console
    console.log(`${process.env[key]} => ${replaceKey}=${replaceContent}`);
  });

  writeFileSync(env, envContent);
}

function encodeKey(key) {
  return CryptoJS.AES.encrypt(key, process.env.VITE_APP_ENCRYPT_KEY).toString();
}
