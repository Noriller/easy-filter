export interface ParsedPart {
  string: string;
  mode: 'NOT' | 'OPTION' | 'QUOTE' | 'TAG' | 'OR';
}
