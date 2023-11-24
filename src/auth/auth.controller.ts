import {
  Body,
  Controller,
  Inject,
  OnModuleInit,
  Post,
  UseGuards,
  Request,
  Req,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import {
  AuthServiceClient,
  RegisterResponse,
  RegisterRequest,
  AUTH_SERVICE_NAME,
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  UpdateRequest,
  UpdateResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
  ForgetPasswordRequest,
  ForgetPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  AddWalletAmountRequest,
  AddWalletAmountResponse,
} from './auth.pb';
import { AuthGuard } from './auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  AddWalletAmountDto,
  ChangePasswordRequestDto,
  ForgetPasswordDto,
  LoginRequestDto,
  RegisterRequestDto,
  ResetPasswordDto,
  UpdateRequestDto,
} from './dto/auth.dto';

@ApiTags('Users')
@Controller('auth')
export class AuthController implements OnModuleInit {
  private svc: AuthServiceClient;

  @Inject(AUTH_SERVICE_NAME)
  private readonly client: ClientGrpc;

  public onModuleInit(): void {
    this.svc = this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }

  /**
   * @author Apurv
   * @description This function will used to register user
   * @Body RegisterRequestDto
   * @Payload firstName, lastName, userName, email, password, contactNumber, address
   */
  @ApiOperation({ summary: 'User Signup' })
  @Post('register')
  private async register(
    @Body() body: RegisterRequestDto,
  ): Promise<Observable<RegisterResponse>> {
    return this.svc.register(body);
  }

  /**
   * @author Apurv
   * @description This function will used for user login
   * @Body LoginRequestDto
   * @Payload email, password
   */
  @ApiOperation({ summary: 'User Login' })
  @Post('login')
  private async login(
    @Body() body: LoginRequestDto,
  ): Promise<Observable<LoginResponse>> {
    return this.svc.login(body);
  }

  /**
   * @author Apurv
   * @description This function will used by user to update their details
   * @Body UpdateRequestDto
   * @Payload firstName, lastName, userName, email, password, contactNumber, address
   */
  @ApiBearerAuth()
  @ApiOperation({ summary: 'User Update' })
  @UseGuards(AuthGuard)
  @Post('update')
  private async update(
    @Body() body: UpdateRequestDto,
  ): Promise<Observable<UpdateResponse>> {
    return this.svc.update(body);
  }

  /**
   * @author Apurv
   * @description This function will send reset password email request to user email id
   * @Body ForgetPasswordDto
   * @Payload email
   */
  @ApiOperation({ summary: 'Send forget password email' })
  @Post('forgetPassword')
  private async forgetPassword(
    @Body() body: ForgetPasswordDto,
  ): Promise<Observable<ForgetPasswordResponse>> {
    return this.svc.forgetPassword(body);
  }

  /**
   * @author Apurv
   * @description This function will used by user to reset their password
   * @Body ResetPasswordDto
   * @Payload otp, email, password
   */
  @ApiOperation({ summary: 'Reset Password' })
  @Post('resetPassword')
  private async resetPassword(
    @Body() body: ResetPasswordDto,
  ): Promise<Observable<ResetPasswordResponse>> {
    return this.svc.resetPassword(body);
  }

  /**
   * @author Apurv
   * @description This function will used by user to reset their password
   * @Body ChangePasswordRequestDto
   * @Payload oldPassword, newPassword
   */
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change Password' })
  @UseGuards(AuthGuard)
  @Post('changePassword')
  private async changePassword(
    @Body() body: ChangePasswordRequestDto,
    @Req() req: any,
  ): Promise<Observable<ChangePasswordResponse>> {
    const changePasswordRequest: ChangePasswordRequest = {
      ...body,
      userId: req.user,
    };
    return this.svc.changePassword(changePasswordRequest);
  }

  /**
   * @author Apurv
   * @description This function will used by user to logout their account
   */
  @ApiBearerAuth()
  @ApiOperation({ summary: 'User logout' })
  @UseGuards(AuthGuard)
  @Post('logout')
  private async logout(@Request() req: any) {
    const userId = req.user;
    return this.svc.logout({ userId: userId });
  }

  /**
   * @author Apurv
   * @description This function will used by user to add money to their wallet
   * @Body AddWalletAmountDto
   * @Payload amount
   */
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add money to wallet' })
  @UseGuards(AuthGuard)
  @Post('addWalletAmount')
  private async addWalletAmount(
    @Body() body: AddWalletAmountDto,
    @Req() req: any,
  ): Promise<Observable<AddWalletAmountResponse>> {
    const userId = req.user;
    return this.svc.addWalletAmount({
      ...body,
      userId: userId,
    });
  }
}
