"use client";
import { create } from "zustand";
import { FlightBookingService } from "@/api/services/FlightBookingService";
import type { FlightSearchResponse } from "@/api/models/FlightSearchResponse";
import type { AirportResponse } from "@/api/models/AirportResponse";
import type { FlightSearchRequest } from "@/api/models/FlightSearchRequest";
import type { CreateFlightBookingRequest } from "@/api/models/CreateFlightBookingRequest";
import type { FlightBookingResponse } from "@/api/models/FlightBookingResponse";

interface FlightStoreState {
    searchCriteria: FlightSearchRequest;
    results: FlightSearchResponse[];
    bookingResult?: FlightBookingResponse;
    airports: AirportResponse[];
    selectedFlight?: FlightSearchResponse;

    loadingSearch: boolean;
    bookingSubmitting: boolean;
    loadingAirports: boolean;
    error?: string;

    setCriteria: (partial: Partial<FlightSearchRequest>) => void;
    search: () => Promise<void>;
    submitBooking: (payload: CreateFlightBookingRequest) => Promise<void>;
    loadAirports: () => Promise<void>;
    setError: (error?: string) => void;
    selectFlight: (flight: FlightSearchResponse) => void;
    clearBooking: () => void;

}

const initialCriteria: FlightSearchRequest = {
    from: "",
    to: "",
    departureDate: new Date().toISOString().substring(0, 10),
    passengerCount: 1,
    class: "Economy",
};

export const useFlightStore = create<FlightStoreState>((set, get) => ({
    searchCriteria: initialCriteria,
    results: [],
    bookingResult: undefined,
    airports: [],
    selectedFlight: undefined,
    loadingSearch: false,
    bookingSubmitting: false,
    loadingAirports: false,
    error: undefined,

    setCriteria: (partial) =>
        set((s) => ({ searchCriteria: { ...s.searchCriteria, ...partial } })),

    search: async () => {
        const { searchCriteria } = get();
        if (!searchCriteria.from || !searchCriteria.to) return;

        set({ loadingSearch: true, results: [], error: undefined });
        try {
            const data = await FlightBookingService.postApiFlightBookingSearch(searchCriteria);
            set({ results: data });
        } catch {
            set({ error: "搜索失败，请重试" });
        } finally {
            set({ loadingSearch: false });
        }
    },

    submitBooking: async (payload) => {
        set({ bookingSubmitting: true, error: undefined });
        try {
            const res = await FlightBookingService.postApiFlightBookingCreate(payload);
            set({ bookingResult: res });
        } catch {
            set({ error: "预订失败，请重试" });
        } finally {
            set({ bookingSubmitting: false });
        }
    },

    loadAirports: async () => {
        set({ loadingAirports: true, error: undefined });
        try {
            const data = await FlightBookingService.getApiFlightBookingAirports();
            set({ airports: data });
        } catch {
            set({ error: "加载机场列表失败" });
        } finally {

            set({ loadingAirports: false });
        }
    },

    setError: (error) => set({ error }),

    selectFlight: (flight) => set({ selectedFlight: flight }),

    clearBooking: () => set({ bookingResult: undefined, selectedFlight: undefined }),
}));
