import { Controller, Inject, Post, OnModuleInit, UseGuards, Req, Body, Param, Put } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { CreateOrderResponse, OrderServiceClient, ORDER_SERVICE_NAME, CreateOrderRequest, CancelOrderResponse, CancelOrderRequest } from './order.pb';
import { AuthGuard } from '../auth/auth.guard';

@Controller('order')
export class OrderController implements OnModuleInit {
  private svc: OrderServiceClient;

  @Inject(ORDER_SERVICE_NAME)
  private readonly client: ClientGrpc;

  public onModuleInit(): void {
    this.svc = this.client.getService<OrderServiceClient>(ORDER_SERVICE_NAME);
  }

  @Post()
  @UseGuards(AuthGuard)
  private async createOrder(@Body() payload:CreateOrderRequest,@Req() req: any): Promise<Observable<CreateOrderResponse>> {
    const userId = req.user;
    const email = req.email;
    const body:CreateOrderRequest = {
      ...payload,
      userId:userId,
      email:email
    }
    return this.svc.createOrder(body);
  }

  @Put('cancelOrder/:orderId')
  @UseGuards(AuthGuard)
  private async cancelOrder(@Param('orderId') orderId:string, @Req() req:any): Promise<Observable<CancelOrderResponse>> {
    const userId = req.user;
    const body:CancelOrderRequest = {
      orderId: orderId,
      userId: userId
    }
    return this.svc.cancelOrder(body);
  }
}