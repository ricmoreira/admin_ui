export class List {
    per_page: number;
    page: number;

    constructor(per_page: number, page: number) {
        this.per_page = per_page;
        this.page = page;
    }
}

// url example: http://products?per_page=10&page=1&sort=id&order=normal
