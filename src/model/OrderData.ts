export interface OrderData {
    id: string;
    customerId: string;
    items: { productId: string; quantity: number }[];
    total: number;
    status: string;

}