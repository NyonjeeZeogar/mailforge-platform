import { IsOptional, IsString } from 'class-validator';

export class VerifyDomainDto {
  @IsOptional()
  @IsString()
  token?: string;
}
