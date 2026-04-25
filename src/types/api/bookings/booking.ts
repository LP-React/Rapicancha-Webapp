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
