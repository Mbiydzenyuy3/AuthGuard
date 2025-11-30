import { Controller, Get, UseGuards } from '@nestjs/common';
import { CognitoGuard } from '../auth/cognito/guard/cognito.guard';
@Controller('user')
export class UserController {
  @Get('me')
  @UseGuards(CognitoGuard)
  getMe() {
    return { success: true };
  }
}
