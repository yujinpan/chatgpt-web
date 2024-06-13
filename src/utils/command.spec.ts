import { describe, it, expect } from 'vitest';

import { getCommandUseChat } from './command';

describe('command', () => {
  it('should getCommandUseChat', async () => {
    expect(await getCommandUseChat('test')).toBe('-1');
  });

  it('should getCommandUseChat model', async () => {
    expect(await getCommandUseChat('change model')).toContain('model');
    expect(await getCommandUseChat('change model gpt3')).toBe('/gpt-3.5-turbo');
    expect(await getCommandUseChat('change model gpt4')).toBe('/gpt-4');
    expect(await getCommandUseChat('change model gemini')).toBe('/gemini1_5');
    expect(await getCommandUseChat('gemini')).toBe('-1');
  });

  it('should getCommandUseChat version', async () => {
    expect(await getCommandUseChat('version')).toBe('/version');
  });

  it('should getCommandUseChat help', async () => {
    expect(await getCommandUseChat('help')).toBe('-1');
    expect(await getCommandUseChat('command help')).toContain('Welcome');
  });

  it('should getCommandUseChat scene', async () => {
    expect(await getCommandUseChat('scene')).toContain('example');
    expect(await getCommandUseChat('scene WayneCorp DC')).toBe(
      '/scene WayneCorp DC',
    );
  });

  it('should getCommandUseChat other', async () => {
    expect(await getCommandUseChat('how are you')).toBe('-1');
    expect(
      await getCommandUseChat('who is the best between you and musk'),
    ).toBe('-1');
  });
});
