import JavaScriptObfuscator from 'javascript-obfuscator';
import { createFilter } from 'vite';

import type { PluginOption, FilterPattern } from 'vite';

const vitePluginObf = (options: { include: FilterPattern }): PluginOption => {
  return {
    name: 'obf',
    enforce: 'post',
    apply: 'build',
    transform(src, id) {
      const filter = createFilter(options.include);
      if (filter(id)) {
        return {
          code: JavaScriptObfuscator.obfuscate(src, {
            compact: true,
            controlFlowFlattening: true,
            controlFlowFlatteningThreshold: 0.75,
            deadCodeInjection: true,
            deadCodeInjectionThreshold: 0.4,
            debugProtection: false,
            debugProtectionInterval: 0,
            disableConsoleOutput: true,
            identifierNamesGenerator: 'hexadecimal',
            log: false,
            numbersToExpressions: true,
            renameGlobals: false,
            selfDefending: true,
            simplify: true,
            splitStrings: true,
            splitStringsChunkLength: 10,
            stringArray: true,
            stringArrayCallsTransform: true,
            stringArrayCallsTransformThreshold: 0.75,
            stringArrayEncoding: ['base64'],
            stringArrayIndexShift: true,
            stringArrayRotate: true,
            stringArrayShuffle: true,
            stringArrayWrappersCount: 2,
            stringArrayWrappersChainedCalls: true,
            stringArrayWrappersParametersMaxCount: 4,
            stringArrayWrappersType: 'function',
            stringArrayThreshold: 0.75,
            transformObjectKeys: true,
            unicodeEscapeSequence: false,
          }).getObfuscatedCode(),
        };
      }
    },
  };
};

export default vitePluginObf;
