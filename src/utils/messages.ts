import { getCommandUseChat } from '@/utils/command';

export function generateStartMsg() {
  return getCommandUseChat('command help');
}
