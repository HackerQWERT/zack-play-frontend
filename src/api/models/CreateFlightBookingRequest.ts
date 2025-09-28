/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
 
import type { CreatePassengerRequest } from './CreatePassengerRequest';
export type CreateFlightBookingRequest = {
    flightId?: string;
    passenger?: CreatePassengerRequest;
    passportNumber?: string;
    dateOfBirth?: string;
    nationality?: string;
    seatsCount?: number;
    cabinClass?: string;
    specialRequests?: string;
};

