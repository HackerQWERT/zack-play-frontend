/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AirportResponse } from '../models/AirportResponse';
import type { CancelFlightBookingRequest } from '../models/CancelFlightBookingRequest';
import type { CreateFlightBookingRequest } from '../models/CreateFlightBookingRequest';
import type { FlightBookingResponse } from '../models/FlightBookingResponse';
import type { FlightSearchRequest } from '../models/FlightSearchRequest';
import type { FlightSearchResponse } from '../models/FlightSearchResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class FlightBookingService {
    /**
     * 获取可用机场列表
     * @returns AirportResponse OK
     * @throws ApiError
     */
    public static getApiFlightBookingAirports(): CancelablePromise<Array<AirportResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/FlightBooking/Airports',
        });
    }
    /**
     * 搜索航班（复杂请求体）
     * @param requestBody
     * @returns FlightSearchResponse OK
     * @throws ApiError
     */
    public static postApiFlightBookingSearch(
        requestBody: FlightSearchRequest,
    ): CancelablePromise<Array<FlightSearchResponse>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/FlightBooking/Search',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * 创建预订（包含乘客信息）
     * @param requestBody
     * @returns FlightBookingResponse OK
     * @throws ApiError
     */
    public static postApiFlightBookingCreate(
        requestBody: CreateFlightBookingRequest,
    ): CancelablePromise<FlightBookingResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/FlightBooking/Create',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * 通过预订参考号查询预订
     * @param reference
     * @returns FlightBookingResponse OK
     * @throws ApiError
     */
    public static getApiFlightBookingGetByReference(
        reference?: string,
    ): CancelablePromise<FlightBookingResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/FlightBooking/GetByReference',
            query: {
                'reference': reference,
            },
        });
    }
    /**
     * 确认预订
     * @param reference
     * @returns FlightBookingResponse OK
     * @throws ApiError
     */
    public static postApiFlightBookingConfirm(
        reference?: string,
    ): CancelablePromise<FlightBookingResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/FlightBooking/Confirm',
            query: {
                'reference': reference,
            },
        });
    }
    /**
     * 取消预订
     * @param requestBody
     * @returns FlightBookingResponse OK
     * @throws ApiError
     */
    public static postApiFlightBookingCancel(
        requestBody: CancelFlightBookingRequest,
    ): CancelablePromise<FlightBookingResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/FlightBooking/Cancel',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * 查询某乘客的所有预订
     * @param passengerId
     * @returns FlightBookingResponse OK
     * @throws ApiError
     */
    public static getApiFlightBookingPassengerBookings(
        passengerId?: string,
    ): CancelablePromise<Array<FlightBookingResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/FlightBooking/PassengerBookings',
            query: {
                'passengerId': passengerId,
            },
        });
    }
}
