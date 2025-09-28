/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateAirportRequest } from '../models/CreateAirportRequest';
import type { CreateFlightRequest } from '../models/CreateFlightRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class FlightBookingAdminService {
    /**
     * 添加新机场（管理员接口）
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static postApiAdminAddAirport(
        requestBody: CreateAirportRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/admin/AddAirport',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * 上传新航班（管理员接口）
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static postApiAdminUploadFlight(
        requestBody: CreateFlightRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/admin/UploadFlight',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
