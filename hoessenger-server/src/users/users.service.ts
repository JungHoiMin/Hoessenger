import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { AddFriendDto } from './dto/add-friend.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}
  async findByEmail(body: { email: string }) {
    const { email } = body;

    if (!(await this.userModel.exists({ email }))) {
      throw new NotFoundException('존재하지 않은 사용자입니다.');
    }

    return this.userModel.findOne({ email });
  }
  async signUp(body: CreateUserDto) {
    const { email, password, name } = body;

    if (await this.userModel.exists({ email })) {
      throw new UnauthorizedException('이미 존재하는 이메일 입니다.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userModel.create({
      email,
      name,
      password: hashedPassword,
    });

    return user.readOnlyData;
  }
  async findFriendsByEmail(body: { email: string }) {
    const { email } = body;

    if (!(await this.userModel.exists({ email }))) {
      throw new NotFoundException('존재하지 않은 사용자입니다.');
    }

    const user = await this.userModel.findOne({ email });
    const friends = await this.userModel.find({ _id: { $in: user.friends } });
    return friends.map((friend) => {
      return {
        id: friend._id,
        email: friend.email,
        name: friend.name,
      };
    });
    // return this.userModel.find({ _id: { $in: user.friends } });
  }
  async beFriend(body: AddFriendDto) {
    const { email1, email2 } = body;

    if (
      !(
        (await this.userModel.exists({ email: email1 })) &&
        (await this.userModel.exists({ email: email2 }))
      )
    ) {
      throw new NotFoundException('존재하지 않은 사용자입니다.');
    }

    await this.userModel.updateOne(
      { email: email1 },
      { $push: { friends: await this.userModel.findOne({ email: email2 }) } },
    );
    await this.userModel.updateOne(
      { email: email2 },
      { $push: { friends: await this.userModel.findOne({ email: email1 }) } },
    );

    return 'OK';
  }
}
