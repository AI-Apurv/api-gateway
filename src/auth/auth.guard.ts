import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpStatus,
  UnauthorizedException,
  Inject,
  HttpException,
} from '@nestjs/common';
import { ValidateResponse } from './auth.pb';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  @Inject(AuthService)
  public readonly service: AuthService;

  public async canActivate(ctx: ExecutionContext): Promise<boolean>{
    const req: any = ctx.switchToHttp().getRequest();
    const authorization: string = req.headers['authorization'];
    if (!authorization) {
      throw new UnauthorizedException();
    }

    const bearer: string[] = authorization.split(' ');

    if (!bearer || bearer.length < 2) {
      throw new UnauthorizedException();
    }
    const token: string = bearer[1];
    const { status, userId, email }: ValidateResponse =
      await this.service.validate(token);
    req.user = userId;
    req.email = email;
    if (status === HttpStatus.BAD_REQUEST)
      throw new HttpException(
        'User has logged out.Login again',
        HttpStatus.BAD_REQUEST,
      );
    else if (status !== HttpStatus.OK) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
