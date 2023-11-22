import { Controller, Inject, Post, OnModuleInit, UseGuards, Req, Body, Param, Put, Get } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { CreateOrderResponse, OrderServiceClient, ORDER_SERVICE_NAME, CreateOrderRequest, CancelOrderResponse, CancelOrderRequest, AddCartRequest, AddCartResponse, UpdateCartRequest, UpdateCartResponse, GetCartItemRequest, GetCartItemResponse, GetOrderDetailsResponse, GetOrderDetailsRequest } from './order.pb';
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
  private async createOrder(@Req() req: any): Promise<Observable<CreateOrderResponse>> {
    const userId = req.user;
    const email = req.email;
    const body: CreateOrderRequest = {
      userId: userId,
      email: email
    }
    return this.svc.createOrder(body);
  }

  @Put('cancelOrder/:orderId')
  @UseGuards(AuthGuard)
  private async cancelOrder(@Param('orderId') orderId: string, @Req() req: any): Promise<Observable<CancelOrderResponse>> {
    const userId = req.user;
    const body: CancelOrderRequest = {
      orderId: orderId,
      userId: userId
    }
    return this.svc.cancelOrder(body);
  }


  @UseGuards(AuthGuard)
  @Post('addCart')
  private async addToCart(@Body() body: AddCartRequest, @Req() req: any): Promise<Observable<AddCartResponse>> {
    const userId = req.user;
    const payload = {
      ...body,
      userId: userId
    }
    return this.svc.addCart(payload);
  }

  @UseGuards(AuthGuard)
  @Post('updateCart')
  private async updateCart(@Body() body: UpdateCartRequest, @Req() req: any): Promise<Observable<UpdateCartResponse>> {
    const userId = req.user;
    const payload = {
      ...body,
      userId: userId
    }
    return this.svc.updateCart(payload);
  }


  @UseGuards(AuthGuard)
  @Post('getCartDetails')
  private async getCart(@Req() req: any): Promise<Observable<GetCartItemResponse>> {
    const userId = req.user;
    return this.svc.getCartDetails({ userId: userId });
  }

  @UseGuards(AuthGuard)
  @Get('getOrderDetails')
  private async getOrderDetails(@Req() req: any): Promise<Observable<GetOrderDetailsResponse>> {
    const userId = req.user;
    return this.svc.getOrderDetails({ userId: userId })
  }


}