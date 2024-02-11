import { WsException } from '@nestjs/websockets';

export class WsRequestException extends WsException {
  request_uuid: string;

  constructor(request_uuid: string, error: object) {
    super(error);
    this.request_uuid = request_uuid;
  }
}
