import { Injectable } from '@nestjs/common';
import { CreateDesiredPositionDto } from './dto/create-desired-position.dto';
import { UpdateDesiredPositionDto } from './dto/update-desired-position.dto';

@Injectable()
export class DesiredPositionService {
  create(createDesiredPositionDto: CreateDesiredPositionDto) {
    return 'This action adds a new desiredPosition';
  }

  findAll() {
    return `This action returns all desiredPosition`;
  }

  findOne(id: number) {
    return `This action returns a #${id} desiredPosition`;
  }

  update(id: number, updateDesiredPositionDto: UpdateDesiredPositionDto) {
    return `This action updates a #${id} desiredPosition`;
  }

  remove(id: number) {
    return `This action removes a #${id} desiredPosition`;
  }
}
