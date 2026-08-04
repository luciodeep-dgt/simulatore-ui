export interface Pageable<T> {
  items: T[];
  size?: number;
  sort?: string;
  offset?: number;
  limit?: number;
  totalCount?: number;
}
