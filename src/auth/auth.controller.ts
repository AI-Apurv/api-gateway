import { Body, Controller, Inject, OnModuleInit, Patch, Post, Put, UseGuards, Request, Req } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { AuthServiceClient, RegisterResponse, RegisterRequest, AUTH_SERVICE_NAME, LoginRequest, LoginResponse, LogoutRequest, UpdateRequest, UpdateResponse, ChangePasswordRequest, ChangePasswordResponse, ForgetPasswordRequest, ForgetPasswordResponse, ResetPasswordRequest, ResetPasswordResponse, AddWalletAmountRequest, AddWalletAmountResponse } from './auth.pb';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController implements OnModuleInit {
  private svc: AuthServiceClient;

  @Inject(AUTH_SERVICE_NAME)
  private readonly client: ClientGrpc;

  public onModuleInit(): void {
    this.svc = this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }

  @Post('register')
  private async register(@Body() body: RegisterRequest): Promise<Observable<RegisterResponse>> {
    return this.svc.register(body);
  }

  @Post('login')
  private async login(@Body() body: LoginRequest): Promise<Observable<LoginResponse>> {
    return this.svc.login(body);
  }

  @UseGuards(AuthGuard)
  @Post('update')
  private async update(@Body() body: UpdateRequest): Promise<Observable<UpdateResponse>> {
    return this.svc.update(body);
  }
  
  @Post('forgetPassword')
  private async forgetPassword(@Body() body: ForgetPasswordRequest): Promise<Observable<ForgetPasswordResponse>> {
    return this.svc.forgetPassword(body);
  }

  @Post('resetPassword')
  private async resetPassword(@Body() body: ResetPasswordRequest): Promise<Observable<ResetPasswordResponse>> {
    return this.svc.resetPassword(body);
  }


  @UseGuards(AuthGuard)
  @Post('changePassword')
  private async changePassword(@Body() body: ChangePasswordRequest, @Req() req:any): Promise<Observable<ChangePasswordResponse>> {
    const changePasswordRequest:ChangePasswordRequest = {
      ...body,
      userId:req.user
    }
    return this.svc.changePassword(changePasswordRequest)
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  private async logout(@Request() req:any){
    const userId = req.user;
    return this.svc.logout({userId:userId});
  }


  @UseGuards(AuthGuard)
  @Post('addWalletAmount')
  private async addWalletAmount(@Body()body:AddWalletAmountRequest, @Req() req:any): Promise<Observable<AddWalletAmountResponse>>{
    const userId = req.user;
    return this.svc.addWalletAmount({
      ...body,
      userId:userId
    })
  }


}