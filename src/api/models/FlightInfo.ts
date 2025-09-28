/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
 
import type { ArrivalInfo } from './ArrivalInfo';
import type { DepartureInfo } from './DepartureInfo';
export type FlightInfo = {
    id?: string;
    flightNumber?: string;
    airline?: string;
    departure?: DepartureInfo;
    arrival?: ArrivalInfo;
};

