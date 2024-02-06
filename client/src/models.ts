export type EyeTracker = {
  address: string;
  model: string;
  name: string;
  serial_number: string;
}

export type WSMessage = {
  type: string;
  status: string;
  value: any;
}