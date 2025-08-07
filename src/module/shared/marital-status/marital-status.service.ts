import { Injectable } from '@nestjs/common';
import { CreateMaritalStatusDto } from './dto/create-marital-status.dto';
import { UpdateMaritalStatusDto } from './dto/update-marital-status.dto';

@Injectable()
export class MaritalStatusService {
  create(createMaritalStatusDto: CreateMaritalStatusDto) {
    return 'This action adds a new maritalStatus';
  }

  findAll() {
    return `This action returns all maritalStatus`;
  }

  findOne(id: number) {
    return `This action returns a #${id} maritalStatus`;
  }

  update(id: number, updateMaritalStatusDto: UpdateMaritalStatusDto) {
    return `This action updates a #${id} maritalStatus`;
  }

  remove(id: number) {
    return `This action removes a #${id} maritalStatus`;
  }
}
