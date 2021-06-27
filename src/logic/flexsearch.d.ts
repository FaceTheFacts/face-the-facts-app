declare module 'flexsearch' {
  export class Index {
    constructor(options?: any);

    add(id: number, token: string): this;

    append(id: number, token: string): this;

    search(query: string, limit?: number): number[];
  }
}
