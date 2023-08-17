export interface currencyResponse {
    base: string,
    date: string,
    rates: {[key: string]: [value: number]},
    success: boolean,
    timestamp: number
}