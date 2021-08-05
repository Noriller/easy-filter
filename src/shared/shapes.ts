export interface ParsedPart {
  payload: string | RangePayload | DateRangePayload | TagPayload;
  mode: 'NOT' | 'OPTION' | 'QUOTE' | 'TAG' | 'RANGE' | 'DATE_RANGE' | 'OR';
}

export interface ParsedResult {
  search: string;
  parsedSearch: ParsedPart[];
}

export interface ParsedRange extends ParsedPart {
  payload: RangePayload;
}

export interface ParsedDateRange extends ParsedPart {
  payload: DateRangePayload;
}

export interface ParsedTag extends ParsedPart {
  payload: TagPayload;
}

export type RangePayload = [number, number];
export type DateRangePayload = [Date, Date];
export type TagPayload = {
  tag: string;
  tagPayload: string;
};
