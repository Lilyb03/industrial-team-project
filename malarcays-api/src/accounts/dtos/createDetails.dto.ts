import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDetailsDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;
}
