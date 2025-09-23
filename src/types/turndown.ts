/* eslint-disable @typescript-eslint/no-explicit-any */
declare module "turndown" {
  export default class TurndownService {
    constructor(options?: any);
    turndown(html: string): string;
    addRule(key: string, rule: any): void;
  }
}
