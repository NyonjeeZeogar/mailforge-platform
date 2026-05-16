export class CreateOrganizationDto {
  name: string;
  supportEmail?: string | null;
  timezone?: string | null;
  plan?: string;
  status?: string;
}
