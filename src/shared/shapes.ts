export interface ParsedPart {
  payload: string | RangePayload | DateRangePayload;
  mode: 'NOT' | 'OPTION' | 'QUOTE' | 'TAG' | 'RANGE' | 'DATE_RANGE' | 'OR';
}

export interface ParsedResult {
  search: string;
  parsedSearch: ParsedPart[];
}

export type RangePayload = number[];
export type DateRangePayload = Date[];
