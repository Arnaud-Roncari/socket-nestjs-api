import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class GatewayAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const client = context.switchToWs().getClient();
      const token = this.extractTokenFromHeader(client.handshake.headers);

      if (!token) {
        throw new UnauthorizedException();
      }
      const payload = this.jwtService.verify(token);
      // Payload is attached to the request object. So we can access it in the controllers.
      client['payload'] = payload;
      return true;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromHeader(headers: object): string | null {
    const [type, token] = headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : null;
  }
}
