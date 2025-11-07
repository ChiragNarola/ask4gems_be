export type SortOrder = 'asc' | 'desc';
export interface IListRM<T = undefined> {
    pageNo: number;
    pageSize: number;
    sort?: {
        key: string;
        order: SortOrder;
    };
    searchKey?: string;
    filterOptions?: T;
}