"use client";
import React from "react";
import { useFlightStore } from "@/store/flightStore";
import { Box, Chip, Typography, Button, Skeleton, Stack } from "@mui/material";
import type { FlightSearchResponse } from "@/api/models/FlightSearchResponse";

export const FlightResults: React.FC<{ onBookAction: () => void }> = ({
  onBookAction,
}) => {
  const { results, loadingSearch, selectedFlight, selectFlight, error } =
    useFlightStore();

  if (loadingSearch) {
    return (
      <Stack spacing={1}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} variant="rectangular" height={96} />
        ))}
      </Stack>
    );
  }

  if (error && results.length === 0) {
    return (
      <Box className="flight-search__empty">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (results.length === 0) {
    return (
      <Box className="flight-search__empty">暂无结果，请调整条件再试。</Box>
    );
  }

  return (
    <div className="flight-search__results">
      {results.map((f: FlightSearchResponse) => {
        const selected = f.id === selectedFlight?.id;
        return (
          <Box
            key={f.id}
            className={`flight-search__result-card ${
              selected ? "flight-search__result-card--selected" : ""
            }`}
            onClick={() => selectFlight(f)}
          >
            <Typography variant="subtitle1" fontWeight={600}>
              {f.airline} {f.flightNumber}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {f.departure?.airportCode} {f.departure?.time} →{" "}
              {f.arrival?.airportCode} {f.arrival?.time}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              时长: {f.duration || "--"} | 机型: {f.aircraft || "--"}
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Chip
                size="small"
                color={f.isDirectFlight ? "success" : "default"}
                label={f.isDirectFlight ? "直飞" : "经停"}
              />
              <Typography fontWeight={600} color="primary.main">
                {f.priceDisplay || (f.price ? `¥${f.price}` : "--")}
              </Typography>
            </Box>
            {selected && (
              <Button
                size="small"
                variant="contained"
                onClick={(e) => {
                  e.stopPropagation();
                  onBookAction();
                }}
                sx={{ mt: 1, alignSelf: "flex-end" }}
              >
                预订
              </Button>
            )}
          </Box>
        );
      })}
    </div>
  );
};
