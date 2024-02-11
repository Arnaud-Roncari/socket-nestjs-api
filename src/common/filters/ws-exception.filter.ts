import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  HttpException,
  UnauthorizedException,
} from '@nestjs/common';
import { Socket } from 'socket.io';

@Catch(UnauthorizedException, BadRequestException)
export class WsExceptionFilter {
  public catch(exception: HttpException, host: ArgumentsHost) {
    const client = host.switchToWs().getClient();
    this.handleError(client, exception);
  }

  public handleError(
    client: Socket,
    exception: UnauthorizedException | BadRequestException,
  ) {
    // Validation pipes throw http errors.
    // So we transform them into Ws exception.
    if (exception instanceof BadRequestException) {
      client.emit('exception', exception.getResponse());
    }
    if (exception instanceof UnauthorizedException) {
      client.disconnect(true);
    }
  }
}
