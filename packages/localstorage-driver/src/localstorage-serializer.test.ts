import { LocalstorageSerializer } from './localstorage-serializer';

const serializer = new LocalstorageSerializer();

const value = { a: 'b', c: 1, d: true, e: ['f'] };

describe('LocalstorageSerializer', () => {

  test('#serialize', async () => {
    expect(await serializer.deserialize(await serializer.serialize(value)))
      .toEqual(value);
  });
});
