export class WebSocketResponse {
  success: boolean;
  request_uuid: string;
  data: any;

  constructor(success: boolean, request_uuid: string, data?: any | null) {
    this.success = success;
    this.request_uuid = request_uuid;
    this.data = data;
  }
}
