/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreatePassengerRequest } from './CreatePassengerRequest';
export type CreateFlightBookingRequest = {
    flightId?: string;
    passenger?: CreatePassengerRequest;
    seatsCount?: number;
    cabinClass?: string;
    specialRequests?: string;
};

