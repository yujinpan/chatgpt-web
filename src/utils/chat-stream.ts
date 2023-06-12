import { Observable } from 'rxjs';

import type { ChatRole } from './chat-data';

export function streamToObservable(stream: ReadableStream<Uint8Array>) {
  return new Observable<ChatAPIStreamData[]>((subscriber) => {
    const reader = stream.getReader();
    const push = () => {
      reader.read().then(
        ({ done, value }) => {
          const json = streamDataToJSON(new TextDecoder('utf-8').decode(value));

          if (done) {
            subscriber.complete();
            return;
          } else {
            subscriber.next(json);
          }

          push();
        },
        (e) => subscriber.error(e),
      );
    };
    push();
  });
}

export type ChatAPIStreamData = {
  choices: {
    delta: {
      role?: ChatRole.ASSISTANT;
      content?: string;
    };
  }[];
};

export function readStreamJSONContent(json: ChatAPIStreamData[]) {
  return json
    .map((item) => item.choices[0].delta?.content)
    .filter((item) => !!item)
    .join('');
}

function streamDataToJSON(data: string): ChatAPIStreamData[] {
  const lines = data.split('\n').filter((item) => item.trim());
  return lines
    .map((item) => {
      const message = item.replace(/^data: /, '');
      if (message !== '[DONE]') {
        try {
          const result = JSON.parse(message) as ChatAPIStreamData;
          if (!result.choices?.length) {
            // eslint-disable-next-line no-console
            console.log('Parse Stream error:', message);
          } else {
            return result;
          }
        } catch (e) {
          // eslint-disable-next-line no-console
          console.log('Parse Stream error:', e, message);
        }
      }
    })
    .filter((item) => !!item);
}
