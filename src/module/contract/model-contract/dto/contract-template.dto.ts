import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

/**
 * DTO for Contract Template.
 */
export class ContractTemplateDto {
  @ApiProperty({
    description: 'The title of the contract.',
    example: 'Service Agreement',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'The description of the contract.',
    example: 'Agreement for providing IT consulting services.',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'The URL of the contract file.',
    example: 'https://myserver.com/contracts/contract-template.pdf',
  })
  @IsNotEmpty()
  @IsString()
  urlFile: string;
}
