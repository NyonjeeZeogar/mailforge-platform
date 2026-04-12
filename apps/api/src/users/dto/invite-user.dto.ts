import { IsEmail, IsOptional, IsString } from 'class-validator';

export class InviteUserDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsString()
  organizationId: string;
}
