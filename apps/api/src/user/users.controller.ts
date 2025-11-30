import { Controller, Get, Param, UseGuards, Patch, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CognitoGuard } from '../auth/cognito/guard/cognito.guard';
import { CurrentUser } from '../auth/current-user.decorator';

import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';

import { UpdateUserDto, UserResponseDto } from './dto/user.dto';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(CognitoGuard)
export class UsersController {
  // eslint-disable-next-line no-unused-vars
  constructor(private usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get currently authenticated user' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  async me(@CurrentUser() user) {
    return this.usersService.findByCognitoSub(user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, type: [UserResponseDto] })
  async getAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: 200,
    description: 'User updated',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async update(@Param('id') id: string, @Body() body: UpdateUserDto) {
    await this.usersService.updateUser(id, body);
    return { success: true };
  }
}
