// Only what the tests read from Node, declared here so the app does not need the full Node type package.
declare module 'node:fs' {
  export function readFileSync(path: string): Uint8Array;
}
