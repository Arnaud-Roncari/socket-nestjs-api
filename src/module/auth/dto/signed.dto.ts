import { IsString } from 'class-validator';

export class SignedDto {
  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }
  @IsString()
  readonly accessToken: string;
}
