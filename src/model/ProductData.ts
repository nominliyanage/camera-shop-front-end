export interface ProductData {
    id: number;
    name: string;
    price: number;
    currency: string;
    image: string;
    description: string;
    category: string;

    filter(param: (product : ProductData) => boolean): string;
}