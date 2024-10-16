import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { scrypt as _scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';
import { UsersService } from './users.service';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async register(email: string, password: string) {
    // see if the email is in use
    const users = await this.userService.findAll(email);
    if (users.length > 0) {
      throw new BadRequestException('User with this Email already exists');
    }

    // hash the user password
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    const result = salt + '.' + hash.toString('hex');

    // create new user and save it
    const newUser = await this.userService.create(email, result);

    // return the user
    return newUser;
  }

  async login(email: string, password: string) {
    const [user] = await this.userService.findAll(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Invalid Credentials');
    }

    return user;
  }
}
