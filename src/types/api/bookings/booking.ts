export interface BookingResponse {
  idBooking: number;
  idSportCourt: number;
  courtName: string;
  customerName: string;
  date: string;
  startTime: string;
  endTime: string;
  price: number;
  qrCode: string;
  status: "CONFIRMED" | "PENDING" | "CANCELLED";
}

export interface CheckInResponse {
  courtName: string;
  customerName: string;
  date: string;
  endTime: string;
  idBooking: number;
  idSportCourt: number;
  price: number;
  qrCode: string;
  startTime: string;
  status: string;
}
