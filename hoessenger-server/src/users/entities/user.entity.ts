import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import mongoose, { Document } from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class User extends Document {
  @Prop({
    required: true,
    unique: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Prop()
  @IsNumber()
  age: number;

  @Prop()
  @IsString()
  sex: string;

  @Prop()
  @IsString()
  imgUrl: string;

  @Prop()
  @IsString()
  bgImgUrl: string;

  @Prop({ type: [String] })
  @IsString()
  imgUrls: string[];

  @Prop({ type: [String] })
  @IsString()
  bgImgUrls: string[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }] })
  friends: User[];

  readonly readOnlyData: {
    id: string;
    email: string;
    name: string;
  };
}

export const UserSchema = SchemaFactory.createForClass(User);
