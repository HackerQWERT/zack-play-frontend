"use client";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  Button,
  TextField,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useFlightStore } from "@/store/flightStore";

interface SearchFormData {
  from: string;
  to: string;
  departureDate: dayjs.Dayjs | null;
  passengerCount: number;
  class: string;
}

const passengerOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const classOptions = [
  { value: "Economy", label: "经济舱" },
  { value: "Business", label: "商务舱" },
  { value: "First", label: "头等舱" },
];

export function SearchForm() {
  const { searchCriteria, setCriteria, search, airports, loadingAirports } =
    useFlightStore();

  const { control, handleSubmit } = useForm<SearchFormData>({
    defaultValues: {
      from: searchCriteria.from || "",
      to: searchCriteria.to || "",
      departureDate: dayjs(searchCriteria.departureDate),
      passengerCount: searchCriteria.passengerCount || 1,
      class: searchCriteria.class || "Economy",
    },
  });

  const onSubmit = (data: SearchFormData) => {
    const fromAirport = airports.find(
      (a) => (a.displayName || a.name) === data.from
    );
    const toAirport = airports.find(
      (a) => (a.displayName || a.name) === data.to
    );
    setCriteria({
      from: fromAirport?.code || data.from,
      to: toAirport?.code || data.to,
      departureDate: data.departureDate?.format("YYYY-MM-DD") || "",
      passengerCount: data.passengerCount,
      class: data.class,
    });
    search();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
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
          mb: 3,
        }}
      >
        <Typography variant="h6">搜索航班</Typography>

        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Controller
            name="from"
            control={control}
            render={({ field }) => (
              <Autocomplete
                freeSolo
                options={airports.map((a) => a.displayName)}
                getOptionLabel={(option) => {
                  console.log("获取到的选项:", option);
                  console.log("获取到的选项类型:", typeof option);
                  return option || "";
                }}
                loading={loadingAirports}
                sx={{ minWidth: 200, flex: 1 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="出发点"
                    placeholder="选择或输入出发机场"
                  />
                )}
                onInputChange={(_, value) => field.onChange(value)}
                inputValue={field.value}
              />
            )}
          />

          <Controller
            name="to"
            control={control}
            render={({ field }) => (
              <Autocomplete
                freeSolo
                options={airports.map((a) => a.displayName)}
                loading={loadingAirports}
                sx={{ minWidth: 200, flex: 1 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="终点"
                    placeholder="选择或输入到达机场"
                  />
                )}
                onInputChange={(_, value) => field.onChange(value)}
                inputValue={field.value}
              />
            )}
          />

          <Controller
            name="departureDate"
            control={control}
            render={({ field }) => (
              <DatePicker
                {...field}
                label="出发日期"
                minDate={dayjs()}
                sx={{ minWidth: 200 }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
              />
            )}
          />
        </Box>

        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Controller
            name="passengerCount"
            control={control}
            render={({ field }) => (
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>乘客数量</InputLabel>
                <Select {...field} label="乘客数量">
                  {passengerOptions.map((num) => (
                    <MenuItem key={num} value={num}>
                      {num}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />

          <Controller
            name="class"
            control={control}
            render={({ field }) => (
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>舱位</InputLabel>
                <Select {...field} label="舱位">
                  {classOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />

          <Button type="submit" variant="contained" sx={{ minWidth: 120 }}>
            搜索
          </Button>
        </Box>
      </Box>
    </LocalizationProvider>
  );
}
