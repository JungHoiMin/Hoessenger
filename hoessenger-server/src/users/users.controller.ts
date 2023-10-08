import {
  Controller,
  Post,
  Body,
  Put,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AddFriendDto } from './dto/add-friend.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { LoginRequestDto } from '../auth/dto/login-request.dto';
import { AuthService } from '../auth/auth.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  async login(@Body() data: LoginRequestDto) {
    return this.authService.jwtLogin(data);
  }

  @Post('signup')
  async signUp(@Body() body: CreateUserDto) {
    return await this.usersService.signUp(body);
  }

  @Get(':email/friend')
  @UseGuards(JwtAuthGuard)
  async findFriendsByEmail(@Param('email') email: string) {
    return await this.usersService.findFriendsByEmail({ email });
  }
  @Put(':email/friend')
  @UseGuards(JwtAuthGuard)
  async beFriend(@Body() body: AddFriendDto) {
    return await this.usersService.beFriend(body);
  }
  //
  // @Get()
  // findAll() {
  //   return this.usersService.findAll();
  // }
  //
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.usersService.findOne(+id);
  // }
  //
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }
  //
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}
