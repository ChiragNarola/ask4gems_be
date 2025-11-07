export interface IPaginatedData<T> {
    items: T[];
    total: number;
    pageNo: number;
    pageSize: number;
}