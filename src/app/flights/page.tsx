"use client";
import React, { useState, useEffect } from "react";
import "./flight-search.scss";
import { SearchForm } from "./components/SearchForm";
import { FlightResults } from "./components/FlightResults";
import { BookingDialog } from "./components/BookingDialog";
import { Box, Typography, Alert, Collapse } from "@mui/material";
import { useFlightStore } from "@/store/flightStore";

export default function FlightsPage() {
  const { error, loadAirports } = useFlightStore();
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => {
    loadAirports();
  }, [loadAirports]);

  return (
    <Box className="flight-search">
      <Box className="flight-search__header">
        <Typography variant="h4" fontWeight={600}>
          机票查询与预订
        </Typography>
      </Box>
      <Collapse in={!!error}>
        {error && (
          <Alert severity="error" sx={{ mb: 1 }}>
            {error}
          </Alert>
        )}
      </Collapse>
      <SearchForm />
      <Box>
        <FlightResults onBookAction={() => setBookingOpen(true)} />
      </Box>
      <BookingDialog
        open={bookingOpen}
        onCloseAction={() => setBookingOpen(false)}
      />
    </Box>
  );
}
