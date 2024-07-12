import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  create(createAdminInput: any) {
    return 'This action adds a new admin';
  }

  findAll() {
    return `This action returns all admin`;
  }

  findOne(id: string) {
    return `This action returns a #${id} admin`;
  }

  update(id: string, updateAdminInput: any) {
    return `This action updates a #${id} admin`;
  }

  remove(id: string) {
    return `This action removes a #${id} admin`;
  }
}
