export class ConnectedUsersDto {
  constructor(parameters: ConnectedUsersDto) {
    Object.assign(this, parameters);
  }

  ids: string[];
}
