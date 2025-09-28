/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FlightInfo } from './FlightInfo';
import type { PassengerInfo } from './PassengerInfo';
export type FlightBookingResponse = {
    id?: string;
    bookingReference?: string;
    status?: string;
    bookingTime?: string;
    totalAmount?: number;
    flight?: FlightInfo;
    passenger?: PassengerInfo;
};

