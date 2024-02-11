import { WsRequestException } from 'src/common/types/ws-request-exception';

export class ChatAlreadyExist extends WsRequestException {
  constructor(request_uuid: string) {
    super(request_uuid, {
      id: 'security:chat:exists',
      message: 'Chat already exists',
    });
  }
}
