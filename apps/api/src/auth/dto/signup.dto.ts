import { IsString, IsEmail } from 'class-validator';
import { StrongPassword } from '../validators/strong-password.validator';

export class SignupDto {
  @IsEmail()
  email: string;

  @IsString()
  @StrongPassword()
  password: string;
}
