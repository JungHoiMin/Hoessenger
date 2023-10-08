import { IsEmail, IsNotEmpty } from 'class-validator';

export class AddFriendDto {
  @IsEmail()
  @IsNotEmpty()
  email1: string;

  @IsEmail()
  @IsNotEmpty()
  email2: string;
}
