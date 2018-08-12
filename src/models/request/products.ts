export class Product {
    id: string;
    type: string;
    code: string;
    group: string;
    description: string;
    numberCode: string;
    customsDetails: CustomsDetails;
}

export class CustomsDetails {
    cncCode: Array<string>;
    unNumber: Array<string>;
}
