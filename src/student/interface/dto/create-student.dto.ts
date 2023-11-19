import { IsEmail, IsNotEmpty } from "class-validator";

export default class CreateStudentDto {
  @IsNotEmpty()
  nickName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}
