import { IsNotEmpty, IsString, IsIn } from 'class-validator';

export class AssignUserDto {
  @IsNotEmpty({ message: 'User ID or email is required' })
  @IsString({ message: 'User ID or email must be a string' })
  user_id: string;

  @IsNotEmpty({ message: 'Role is required' })
  @IsString({ message: 'Role must be a string' })
  @IsIn(['owner', 'developer', 'viewer'], { message: 'Role must be either "owner", "developer", or "viewer"' })
  role: string;
}


