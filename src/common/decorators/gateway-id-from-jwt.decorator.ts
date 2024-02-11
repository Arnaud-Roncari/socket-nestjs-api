import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { JwtContent } from 'src/common/types/jwt-content';

export const GatewayIdFromJWT = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const client = ctx.switchToWs().getClient();
    const payload: JwtContent = client['payload'];
    return payload.id;
  },
);
