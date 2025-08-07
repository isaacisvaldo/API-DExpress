import { Injectable } from '@nestjs/common';
import { CreateHighestDegreeDto } from './dto/create-highest-degree.dto';
import { UpdateHighestDegreeDto } from './dto/update-highest-degree.dto';

@Injectable()
export class HighestDegreeService {
  create(createHighestDegreeDto: CreateHighestDegreeDto) {
    return 'This action adds a new highestDegree';
  }

  findAll() {
    return `This action returns all highestDegree`;
  }

  findOne(id: number) {
    return `This action returns a #${id} highestDegree`;
  }

  update(id: number, updateHighestDegreeDto: UpdateHighestDegreeDto) {
    return `This action updates a #${id} highestDegree`;
  }

  remove(id: number) {
    return `This action removes a #${id} highestDegree`;
  }
}
