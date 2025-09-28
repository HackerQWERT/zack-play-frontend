/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ArrivalInfo } from './ArrivalInfo';
import type { DepartureInfo } from './DepartureInfo';
export type FlightSearchResponse = {
    id?: string;
    flightNumber?: string;
    airline?: string;
    airlineCode?: string;
    departure?: DepartureInfo;
    arrival?: ArrivalInfo;
    duration?: string;
    price?: number;
    priceDisplay?: string;
    availableSeats?: number;
    aircraft?: string;
    isDirectFlight?: boolean;
    amenities?: Array<string>;
};

