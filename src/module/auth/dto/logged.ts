import { IsString } from 'class-validator';

export class LoggedDto {
  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }
  @IsString()
  readonly accessToken: string;
}
