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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
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
    gender: "",
    passportNumber: "",
    passportCountry: "",
    nationality: "",
    phoneNumber: "",
  });

  useEffect(() => {
    if (!open) {
      setPassenger({
        firstName: "",
        lastName: "",
        email: "",
        gender: "",
        passportNumber: "",
        passportCountry: "",
        nationality: "",
        phoneNumber: "",
      });
      clearBooking();
    }
  }, [open, clearBooking]);

  if (!selectedFlight) return null;

  const submit = async () => {
    if (
      !passenger.firstName ||
      !passenger.lastName ||
      !passenger.email ||
      !passenger.gender ||
      !passenger.passportNumber ||
      !passenger.passportCountry ||
      !passenger.nationality ||
      !passenger.phoneNumber
    )
      return;
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
            <FormControl size="small" fullWidth>
              <InputLabel>性别</InputLabel>
              <Select
                value={passenger.gender}
                label="性别"
                onChange={(e) =>
                  setPassenger((p) => ({ ...p, gender: e.target.value }))
                }
              >
                <MenuItem value="Male">男</MenuItem>
                <MenuItem value="Female">女</MenuItem>
                <MenuItem value="Other">其他</MenuItem>
              </Select>
            </FormControl>
            <TextField
              size="small"
              label="护照号码"
              value={passenger.passportNumber}
              onChange={(e) =>
                setPassenger((p) => ({ ...p, passportNumber: e.target.value }))
              }
            />
            <TextField
              size="small"
              label="护照国家"
              value={passenger.passportCountry}
              onChange={(e) =>
                setPassenger((p) => ({ ...p, passportCountry: e.target.value }))
              }
            />
            <TextField
              size="small"
              label="国籍"
              value={passenger.nationality}
              onChange={(e) =>
                setPassenger((p) => ({ ...p, nationality: e.target.value }))
              }
            />
            <TextField
              size="small"
              label="电话号码"
              value={passenger.phoneNumber}
              onChange={(e) =>
                setPassenger((p) => ({ ...p, phoneNumber: e.target.value }))
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
              !passenger.email ||
              !passenger.gender ||
              !passenger.passportNumber ||
              !passenger.passportCountry ||
              !passenger.nationality ||
              !passenger.phoneNumber
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
