import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import {
  AddWalletAmountRequest,
  ChangePasswordRequest,
  ForgetPasswordRequest,
  LoginRequest,
  LogoutRequest,
  RegisterRequest,
  ResetPasswordRequest,
  UpdateRequest,
  ValidateRequest,
} from '../auth.pb';

export class LoginRequestDto implements LoginRequest {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'apurv07@gmail.com' })
  public readonly email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Pass@123' })
  public readonly password: string;
}

export class RegisterRequestDto implements RegisterRequest {
  @ApiProperty({ example: 'Apurv' })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Dubey' })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'apurv_07' })
  @IsString()
  @Length(5, 20)
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message:
      'Username must be at least 5 characters long and contain only letters, numbers, and underscores',
  })
  userName: string;

  @ApiProperty({ example: 'apurv07@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Pass@123' })
  @IsString()
  @IsNotEmpty()
  @Length(6, 20)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    {
      message:
        'Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character',
    },
  )
  password: string;

  @ApiProperty({ example: '1234567890' })
  @IsNotEmpty()
  @Length(10, 10, {
    message: 'Invalid contact number format. It should be 10 digit long ',
  })
  @IsNumberString(
    { no_symbols: true },
    { message: 'Contact number can only contain numbers' },
  )
  contactNumber: string;

  @ApiProperty({ example: '123,Ayodhya ,UP' })
  @IsNotEmpty()
  @IsString()
  address: string;
}

export class ValidateRequestDto implements ValidateRequest {
  @IsString()
  @ApiHideProperty()
  public readonly token: string;
}

export class LogoutRequestDto implements LogoutRequest {
  @IsString()
  @ApiHideProperty()
  public readonly userId: string;
}

export class UpdateRequestDto implements UpdateRequest {
  @ApiProperty({ example: 'Apurv' })
  @IsString()
  @IsOptional()
  firstName: string;

  @ApiProperty({ example: 'Dubey' })
  @IsString()
  @IsOptional()
  lastName: string;

  @ApiProperty({ example: 'apurv_07' })
  @IsString()
  @IsOptional()
  @Length(5, 20)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message:
      'Username must be at least 5 characters long and contain only letters, numbers, and underscores',
  })
  userName: string;

  @ApiProperty({ example: 'apurv07@gmail.com' })
  @IsString()
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Pass@123' })
  @IsString()
  @IsOptional()
  @Length(6, 20)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    {
      message:
        'Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character',
    },
  )
  password: string;

  @ApiProperty({ example: '1234567890' })
  @IsString()
  @IsOptional()
  @Length(10, 10, {
    message: 'Invalid contact number format. It should be 10 digit long ',
  })
  @IsNumberString(
    { no_symbols: true },
    { message: 'Contact number can only contain numbers' },
  )
  contactNumber: string;

  @ApiProperty({ example: '123,Ayodhya U.P.' })
  @IsString()
  @IsOptional()
  address: string;

  @ApiHideProperty()
  userId: string;
}

export class ChangePasswordRequestDto implements ChangePasswordRequest {
  @ApiProperty({ example: 'Pass@123' })
  @IsString()
  oldPassword: string;

  @ApiProperty({ example: 'Pass@1234' })
  @IsString()
  @Length(6, 20)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    {
      message:
        'Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character',
    },
  )
  newPassword: string;

  @ApiHideProperty()
  userId: string;
}

export class ForgetPasswordDto implements ForgetPasswordRequest {
  @ApiProperty({ example: 'apurv07@gmail.com' })
  @IsEmail()
  email: string;
}

export class ResetPasswordDto implements ResetPasswordRequest {
  @ApiProperty({ example: '1234' })
  @IsString()
  otp: string;

  @ApiProperty({ example: 'apurv07@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Pass@123' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    {
      message:
        'Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character',
    },
  )
  @IsString()
  password: string;
}

export class AddWalletAmountDto implements AddWalletAmountRequest {
  @ApiProperty({ example: '1000' })
  @IsNotEmpty()
  amount: number;

  @ApiHideProperty()
  userId: string;
}
