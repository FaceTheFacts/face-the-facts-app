declare module 'flexsearch' {
  export class Index {
    constructor(options?: any);

    add(id: number, token: string): this;

    append(id: number, token: string): this;

    search(query: string, limit?: number): number[];
  }

  export interface DocumentSearchResult {
    field: string;
    result: number[];
  }

  export class Document {
    constructor(options?: any);

    add(id: number, content: object): this;

    append(id: number, content: object): this;

    search(query: string, limit?: number): DocumentSearchResult[];

    searchAsync(query: string, limit?: number): Promise<DocumentSearchResult[]>;
  }
}
