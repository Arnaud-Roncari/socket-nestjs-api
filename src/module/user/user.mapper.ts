import { UserDto } from './dto/user.dto';
import { UserEntity } from './user.entity';

export class UserMapper {
  static toUserDto(entity: UserEntity): UserDto {
    return new UserDto({
      id: entity.id,
      username: entity.username,
      avatar_number: entity.avatarNumber,
    });
  }

  static toUsersDto(entities: UserEntity[]): UserDto[] {
    return entities.map((e) => this.toUserDto(e));
  }
}
