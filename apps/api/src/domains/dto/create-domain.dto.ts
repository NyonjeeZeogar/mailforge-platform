import { IsBoolean, IsOptional, IsString, Matches } from 'class-validator';

export class CreateDomainDto {
  @IsString()
  organizationId: string;

  @IsString()
  @Matches(/^(?!-)(?:[a-zA-Z0-9-]{1,63}\.)+[a-zA-Z]{2,63}$/, {
    message: 'Domain must be a valid root domain like example.com',
  })
  name: string;

  @IsOptional()
  @IsBoolean()
  isCatchAllEnabled?: boolean;
}
