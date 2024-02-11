import { WsRequestException } from 'src/common/types/ws-request-exception';

export class ChatNotFoundException extends WsRequestException {
  constructor(request_uuid: string) {
    super(request_uuid, {
      id: 'security:chat:not_found',
      message: 'Chat not found',
    });
  }
}
