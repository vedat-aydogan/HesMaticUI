export interface CheckVisitorHesCodeModel {
    city: string;
    district: string;
    explicit_address: string;
    hes_code: string;
    location: {
        latitude: number,
        longitude: number
    }
}