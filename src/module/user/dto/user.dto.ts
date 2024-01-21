export class UserDto {
  constructor(parameters: UserDto) {
    Object.assign(this, parameters);
  }

  id: string;
  username: string;
  avatar_number: string;
}
