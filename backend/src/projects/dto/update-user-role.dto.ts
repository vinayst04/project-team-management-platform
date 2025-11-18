import { IsNotEmpty, IsString, IsIn } from 'class-validator';

export class UpdateUserRoleDto {
  @IsNotEmpty({ message: 'Role is required' })
  @IsString({ message: 'Role must be a string' })
  @IsIn(['owner', 'developer', 'viewer'], { message: 'Role must be either "owner", "developer", or "viewer"' })
  role: string;
}


