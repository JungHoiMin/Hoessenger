import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginRequestDto } from './dto/login-request.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async jwtLogin(data: LoginRequestDto) {
    const { email, password } = data;
    const user = await this.userService.findByEmail({ email });

    const isPasswordValidated: boolean = await bcrypt.compare(
      password,
      user.password,
    );

    if (!isPasswordValidated) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }

    const payload = { email: user.email, id: user._id };
    return {
      email: user.email,
      name: user.name,
      age: user.age,
      sex: user.sex,
      imgUrl: user.imgUrl,
      bgImgUrl: user.bgImgUrl,
      token: this.jwtService.sign(payload),
    };
  }
}
