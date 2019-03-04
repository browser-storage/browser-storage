import { WebsqlSerializer } from './websql-serializer';

const serializer = new WebsqlSerializer();

const value = {a: 'b', c: 1, d: true, e: ['f']};

describe('LocalstorageSerializer', () => {

  test('#serialize', async () => {
    expect(await serializer.deserialize(await serializer.serialize(value)))
      .toEqual(value);
  });
});
