import { SessionstorageSerializer } from './sessionstorage-serializer';

const serializer = new SessionstorageSerializer();

const value = { a: 'b', c: 1, d: true, e: ['f'] };

describe('SessionstorageSerializer', () => {
  test('#serialize', async () => {
    expect(await serializer.deserialize(await serializer.serialize(value)))
      .toEqual(value);
  });
});
