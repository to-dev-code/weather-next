export type TempUnit = "celsius" | "fahrenheit";

export interface Weather {
    temperature: {
        celsius: number,
        fahrenheit: number
    };
    precipitation: number;
    humidity: number;
    wind: number;
}