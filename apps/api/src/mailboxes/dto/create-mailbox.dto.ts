import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateMailboxDto {
  @IsString()
  localPart: string;

  @IsString()
  domainId: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  displayName?: string;

  @IsOptional()
  @IsBoolean()
  isCatchAll?: boolean;

  @IsOptional()
  @IsInt()
  @Min(1)
  quotaMb?: number;
}
