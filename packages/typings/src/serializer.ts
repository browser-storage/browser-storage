export interface Serializer {
  serialize(value: any): Promise<string>;

  deserialize<T>(value: string | null): Promise<T>;
}
