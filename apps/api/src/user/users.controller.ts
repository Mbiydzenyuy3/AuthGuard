import { Controller, Get, Param, UseGuards, Patch, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CognitoGuard } from '../auth/cognito/guard/cognito.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('users')
@UseGuards(CognitoGuard)
export class UsersController {
  // eslint-disable-next-line no-unused-vars
  constructor(private usersService: UsersService) {}

  @Get('me')
  async me(@CurrentUser() user) {
    return this.usersService.findByCognitoSub(user.sub);
  }

  @Get()
  async getAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body) {
    await this.usersService.updateUser(id, body);
    return { success: true };
  }
}
