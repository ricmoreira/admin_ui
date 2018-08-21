export class StockMov {
    id: string
    MovementType: string
    DocumentID: string
    Line: number
    Quantity: number
    ProductCode: string
    UnitOfMeasure: string
    Time: Date
}

export class StockMovCreate {
    MovementType: string
    DocumentID: string
    Line: number
    Quantity: number
    ProductCode: string
    UnitOfMeasure: string
    Time: Date
}
