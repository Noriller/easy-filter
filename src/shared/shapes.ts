export interface ParsedPart {
  payload: string;
  mode: 'NOT' | 'OPTION' | 'QUOTE' | 'TAG' | 'RANGE' | 'DATE_RANGE' | 'OR';
  childs?: ParsedPart[];
}

export interface ParsedResult {
  search: string;
  parsedSearch: ParsedPart[];
}

export interface ParsedRange extends ParsedPart {
  range: RangePayload | DateRangePayload;
}

export interface ParsedTag extends ParsedPart {
  tag: string;
}

export type RangePayload = [number, number];
export type DateRangePayload = [Date, Date];
