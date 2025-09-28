"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Alert,
  Collapse,
  Box,
  CircularProgress,
} from "@mui/material";
import { useFlightStore } from "@/store/flightStore";
import type { CreateFlightBookingRequest } from "@/api/models/CreateFlightBookingRequest";
import type { CreatePassengerRequest } from "@/api/models/CreatePassengerRequest";

interface Props {
  open: boolean;
  onCloseAction: () => void;
}

export const BookingDialog: React.FC<Props> = ({ open, onCloseAction }) => {
  const {
    selectedFlight,
    bookingSubmitting,
    submitBooking,
    bookingResult,
    clearBooking,
    error,
  } = useFlightStore();
  const [passenger, setPassenger] = useState<CreatePassengerRequest>({
    firstName: "",
    lastName: "",
    email: "",
  });

  useEffect(() => {
    if (!open) {
      setPassenger({ firstName: "", lastName: "", email: "" });
      clearBooking();
    }
  }, [open, clearBooking]);

  if (!selectedFlight) return null;

  const submit = async () => {
    if (!passenger.firstName || !passenger.lastName || !passenger.email) return;
    const payload: CreateFlightBookingRequest = {
      flightId: selectedFlight.id,
      passenger: passenger,
    };
    await submitBooking(payload);
  };

  const success = !!bookingResult?.bookingReference;

  return (
    <Dialog open={open} onClose={onCloseAction} maxWidth="sm" fullWidth>
      <DialogTitle>预订航班</DialogTitle>
      <DialogContent dividers>
        <Box className="booking-dialog__flight-summary">
          <Typography fontWeight={600}>
            {selectedFlight.airline} {selectedFlight.flightNumber}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {selectedFlight.departure?.airportCode} →{" "}
            {selectedFlight.arrival?.airportCode}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            出发:{" "}
            {selectedFlight.departure?.timeDisplay ||
              selectedFlight.departure?.time}{" "}
            | 到达:{" "}
            {selectedFlight.arrival?.timeDisplay ||
              selectedFlight.arrival?.time}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            价格: {selectedFlight.priceDisplay || selectedFlight.price}
          </Typography>
        </Box>
        <Collapse in={!!error}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
        </Collapse>
        <Collapse in={success}>
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              预订成功! 参考号: {bookingResult!.bookingReference}
            </Alert>
          )}
        </Collapse>
        {!success && (
          <div className="booking-dialog__passenger-fields">
            <TextField
              size="small"
              label="名"
              value={passenger.firstName}
              onChange={(e) =>
                setPassenger((p) => ({ ...p, firstName: e.target.value }))
              }
            />
            <TextField
              size="small"
              label="姓"
              value={passenger.lastName}
              onChange={(e) =>
                setPassenger((p) => ({ ...p, lastName: e.target.value }))
              }
            />
            <TextField
              size="small"
              label="邮箱"
              type="email"
              value={passenger.email}
              onChange={(e) =>
                setPassenger((p) => ({ ...p, email: e.target.value }))
              }
            />
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onCloseAction} disabled={bookingSubmitting}>
          关闭
        </Button>
        {!success && (
          <Button
            variant="contained"
            onClick={submit}
            disabled={
              bookingSubmitting ||
              !passenger.firstName ||
              !passenger.lastName ||
              !passenger.email
            }
            startIcon={
              bookingSubmitting ? <CircularProgress size={18} /> : undefined
            }
          >
            {bookingSubmitting ? "提交中" : "提交预订"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
