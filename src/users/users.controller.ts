import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('auth')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post('register')
  createUser(@Body() body: CreateUserDto) {
    return this.userService.create(body.email, body.password);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async findUser(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.findOne(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.userService.findAll(email);
  }

  @Patch(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserDto,
  ) {
    return this.userService.update(id, body);
  }

  @Delete(':id')
  removeUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}
