export abstract class PageRequest {
  page: number | 1;
  pageSize: number | 10;

  get offset(): number {
    return (this.page - 1) * this.pageSize;
  }

  get limit(): number {
    return this.pageSize;
  }
}
