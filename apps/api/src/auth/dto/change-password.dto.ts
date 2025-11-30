import { IsString } from 'class-validator';
import { StrongPassword } from '../validators/strong-password.validator';

export class ChangePasswordDto {
  @IsString()
  @StrongPassword()
  currentPassword: string;

  @IsString()
  @StrongPassword()
  newPassword: string;
}
