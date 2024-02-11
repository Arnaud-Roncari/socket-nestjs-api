export class ConnectedUserDto {
  constructor(parameters: ConnectedUserDto) {
    Object.assign(this, parameters);
  }

  id: string;
}
