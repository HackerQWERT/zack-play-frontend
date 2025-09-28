"use client";
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Collapse,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { FlightBookingAdminService } from "@/api/services/FlightBookingAdminService";
import { FlightBookingService } from "@/api/services/FlightBookingService";
import type { CreateFlightRequest } from "@/api/models/CreateFlightRequest";
import type { AirportResponse } from "@/api/models/AirportResponse";

interface UploadFlightFormData {
  flightNumber: string;
  airlineCode: string;
  airlineName: string;
  departureAirportCode: string;
  departureTime: dayjs.Dayjs | null;
  departureTerminal: string;
  arrivalAirportCode: string;
  arrivalTime: dayjs.Dayjs | null;
  arrivalTerminal: string;
  aircraftType: string;
  totalSeats: number;
  basePrice: number;
}

// 航空公司数据
const airlines = [
  { code: "CA", name: "中国国际航空" },
  { code: "CZ", name: "中国南方航空" },
  { code: "MU", name: "中国东方航空" },
  { code: "HU", name: "海南航空" },
  { code: "SC", name: "山东航空" },
  { code: "FM", name: "上海航空" },
  { code: "ZH", name: "深圳航空" },
  { code: "3U", name: "四川航空" },
  { code: "8L", name: "祥鹏航空" },
  { code: "KN", name: "中国联合航空" },
];

// 航站楼数据
const terminals = ["T1", "T2", "T3", "T4", "T5", "国际出发", "国内出发"];

// 飞机型号数据
const aircraftTypes = [
  "Boeing 737-800",
  "Boeing 737-900",
  "Boeing 777-300ER",
  "Airbus A320",
  "Airbus A321",
  "Airbus A330-300",
  "Airbus A350-900",
  "Embraer E190",
  "Comac C919",
];

export default function AdminFlightsPage() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [airports, setAirports] = useState<AirportResponse[]>([]);
  const [loadingAirports, setLoadingAirports] = useState(false);

  const { control, handleSubmit, reset, watch } = useForm<UploadFlightFormData>(
    {
      defaultValues: {
        flightNumber: "",
        airlineCode: "",
        airlineName: "",
        departureAirportCode: "",
        departureTime: null,
        departureTerminal: "",
        arrivalAirportCode: "",
        arrivalTime: null,
        arrivalTerminal: "",
        aircraftType: "",
        totalSeats: 0,
        basePrice: 0,
      },
    }
  );

  const watchedAirlineCode = watch("airlineCode");

  useEffect(() => {
    loadAirports();
  }, []);

  useEffect(() => {
    const selectedAirline = airlines.find((a) => a.code === watchedAirlineCode);
    if (selectedAirline) {
      reset((prev) => ({ ...prev, airlineName: selectedAirline.name }));
    }
  }, [watchedAirlineCode, reset]);

  const loadAirports = async () => {
    setLoadingAirports(true);
    try {
      const data = await FlightBookingService.getApiFlightBookingAirports();
      setAirports(data);
    } catch (err) {
      console.error("加载机场列表失败:", err);
    } finally {
      setLoadingAirports(false);
    }
  };

  const onSubmit = async (data: UploadFlightFormData) => {
    try {
      setError(null);
      setSuccess(false);

      const requestData: CreateFlightRequest = {
        ...data,
        departureTime: data.departureTime?.toISOString(),
        arrivalTime: data.arrivalTime?.toISOString(),
      };

      await FlightBookingAdminService.postApiAdminUploadFlight(requestData);
      setSuccess(true);
      reset();
    } catch (err: any) {
      setError(err.message || "上传失败");
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" fontWeight={600} sx={{ mb: 3 }}>
          管理员 - 上传航班信息
        </Typography>

        <Collapse in={!!error}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
        </Collapse>

        <Collapse in={success}>
          <Alert severity="success" sx={{ mb: 2 }}>
            航班信息上传成功！
          </Alert>
        </Collapse>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            p: 3,
            border: "1px solid #ddd",
            borderRadius: 2,
          }}
        >
          <Typography variant="h6">航班信息</Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Controller
                name="flightNumber"
                control={control}
                rules={{ required: "航班号不能为空" }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="航班号"
                    sx={{ minWidth: 200, flex: 1 }}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
              <Controller
                name="airlineCode"
                control={control}
                rules={{ required: "请选择航空公司" }}
                render={({ field, fieldState }) => (
                  <FormControl
                    sx={{ minWidth: 200, flex: 1 }}
                    error={!!fieldState.error}
                  >
                    <InputLabel>航空公司</InputLabel>
                    <Select {...field} label="航空公司">
                      {airlines.map((airline) => (
                        <MenuItem key={airline.code} value={airline.code}>
                          {airline.code} - {airline.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {fieldState.error && (
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ mt: 0.5, ml: 1 }}
                      >
                        {fieldState.error.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
            </Box>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Controller
                name="airlineName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="航空公司名称"
                    sx={{ minWidth: 200, flex: 1 }}
                    disabled
                    value={
                      airlines.find((a) => a.code === field.value)?.name || ""
                    }
                  />
                )}
              />
              <Controller
                name="aircraftType"
                control={control}
                rules={{ required: "请选择飞机型号" }}
                render={({ field, fieldState }) => (
                  <FormControl
                    sx={{ minWidth: 200, flex: 1 }}
                    error={!!fieldState.error}
                  >
                    <InputLabel>飞机型号</InputLabel>
                    <Select {...field} label="飞机型号">
                      {aircraftTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                    {fieldState.error && (
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ mt: 0.5, ml: 1 }}
                      >
                        {fieldState.error.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
            </Box>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Controller
                name="departureAirportCode"
                control={control}
                rules={{ required: "请选择出发机场" }}
                render={({ field, fieldState }) => (
                  <Autocomplete
                    options={airports}
                    getOptionLabel={(option) =>
                      option.displayName || option.name || ""
                    }
                    loading={loadingAirports}
                    sx={{ minWidth: 200, flex: 1 }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="出发机场"
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                      />
                    )}
                    onChange={(_, value) => field.onChange(value?.code || "")}
                    value={airports.find((a) => a.code === field.value) || null}
                  />
                )}
              />
              <Controller
                name="departureTerminal"
                control={control}
                render={({ field }) => (
                  <FormControl sx={{ minWidth: 200, flex: 1 }}>
                    <InputLabel>出发航站楼</InputLabel>
                    <Select {...field} label="出发航站楼">
                      {terminals.map((terminal) => (
                        <MenuItem key={terminal} value={terminal}>
                          {terminal}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Box>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Controller
                name="arrivalAirportCode"
                control={control}
                rules={{ required: "请选择到达机场" }}
                render={({ field, fieldState }) => (
                  <Autocomplete
                    options={airports}
                    getOptionLabel={(option) =>
                      option.displayName || option.name || ""
                    }
                    loading={loadingAirports}
                    sx={{ minWidth: 200, flex: 1 }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="到达机场"
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                      />
                    )}
                    onChange={(_, value) => field.onChange(value?.code || "")}
                    value={airports.find((a) => a.code === field.value) || null}
                  />
                )}
              />
              <Controller
                name="arrivalTerminal"
                control={control}
                render={({ field }) => (
                  <FormControl sx={{ minWidth: 200, flex: 1 }}>
                    <InputLabel>到达航站楼</InputLabel>
                    <Select {...field} label="到达航站楼">
                      {terminals.map((terminal) => (
                        <MenuItem key={terminal} value={terminal}>
                          {terminal}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Box>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Controller
                name="departureTime"
                control={control}
                rules={{ required: "出发时间不能为空" }}
                render={({ field, fieldState }) => (
                  <DateTimePicker
                    label="出发时间"
                    value={field.value}
                    onChange={field.onChange}
                    slotProps={{
                      textField: {
                        sx: { minWidth: 200, flex: 1 },
                        error: !!fieldState.error,
                        helperText: fieldState.error?.message,
                      },
                    }}
                  />
                )}
              />
              <Controller
                name="arrivalTime"
                control={control}
                rules={{ required: "到达时间不能为空" }}
                render={({ field, fieldState }) => (
                  <DateTimePicker
                    label="到达时间"
                    value={field.value}
                    onChange={field.onChange}
                    slotProps={{
                      textField: {
                        sx: { minWidth: 200, flex: 1 },
                        error: !!fieldState.error,
                        helperText: fieldState.error?.message,
                      },
                    }}
                  />
                )}
              />
            </Box>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Controller
                name="totalSeats"
                control={control}
                rules={{
                  required: "总座位数不能为空",
                  min: { value: 1, message: "座位数必须大于0" },
                }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="总座位数"
                    type="number"
                    sx={{ minWidth: 200, flex: 1 }}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value) || 0)
                    }
                  />
                )}
              />
              <Controller
                name="basePrice"
                control={control}
                rules={{
                  required: "基础价格不能为空",
                  min: { value: 0, message: "价格不能为负数" },
                }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="基础价格"
                    type="number"
                    sx={{ minWidth: 200, flex: 1 }}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    onChange={(e) =>
                      field.onChange(parseFloat(e.target.value) || 0)
                    }
                  />
                )}
              />
            </Box>
          </Box>

          <Box sx={{ mt: 2 }}>
            <Button type="submit" variant="contained" size="large">
              上传航班
            </Button>
          </Box>
        </Box>
      </Box>
    </LocalizationProvider>
  );
}
