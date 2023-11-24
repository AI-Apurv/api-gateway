import {
  Controller,
  Inject,
  Post,
  OnModuleInit,
  UseGuards,
  Req,
  Body,
  Param,
  Put,
  Get,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import {
  CreateOrderResponse,
  OrderServiceClient,
  ORDER_SERVICE_NAME,
  CreateOrderRequest,
  CancelOrderResponse,
  CancelOrderRequest,
  AddCartRequest,
  AddCartResponse,
  UpdateCartRequest,
  UpdateCartResponse,
  GetCartItemRequest,
  GetCartItemResponse,
  GetOrderDetailsResponse,
  GetOrderDetailsRequest,
} from './order.pb';
import { AuthGuard } from '../auth/auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AddCartDto, UpdateCartDto } from './dto/order.dto';

@ApiTags('Orders')
@Controller('order')
export class OrderController implements OnModuleInit {
  private svc: OrderServiceClient;

  @Inject(ORDER_SERVICE_NAME)
  private readonly client: ClientGrpc;

  public onModuleInit(): void {
    this.svc = this.client.getService<OrderServiceClient>(ORDER_SERVICE_NAME);
  }

  /**
   * @author Apurv
   * @description This function will used by user to place their order
   */
  @ApiOperation({ summary: 'Place the order' })
  @ApiBearerAuth()
  @Post()
  @UseGuards(AuthGuard)
  private async createOrder(
    @Req() req: any,
  ): Promise<Observable<CreateOrderResponse>> {
    const userId = req.user;
    const email = req.email;
    const body: CreateOrderRequest = {
      userId: userId,
      email: email,
    };
    return this.svc.createOrder(body);
  }

  /**
   * @author Apurv
   * @description This function will used by user to cancel their order
   * @Param orderId
   */
  @ApiOperation({ summary: 'Cancel the order' })
  @ApiBearerAuth()
  @Put('cancelOrder/:orderId')
  @UseGuards(AuthGuard)
  private async cancelOrder(
    @Param('orderId') orderId: string,
    @Req() req: any,
  ): Promise<Observable<CancelOrderResponse>> {
    const userId = req.user;
    const body: CancelOrderRequest = {
      orderId: orderId,
      userId: userId,
    };
    return this.svc.cancelOrder(body);
  }

  /**
   * @author Apurv
   * @description This function will used by user to add product to their cart
   * @Body AddCartDto
   * @Payload productId, quantity
   */
  @ApiOperation({ summary: 'Add product to the cart' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('addCart')
  private async addToCart(
    @Body() body: AddCartDto,
    @Req() req: any,
  ): Promise<Observable<AddCartResponse>> {
    const userId = req.user;
    const payload = {
      ...body,
      userId: userId,
    };
    return this.svc.addCart(payload);
  }

  /**
   * @author Apurv
   * @description This function will used by user to update product in their cart
   * @Body UpdateCartDto
   * @Payload productId, quantity
   */
  @ApiOperation({ summary: 'Update the cart' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('updateCart')
  private async updateCart(
    @Body() body: UpdateCartDto,
    @Req() req: any,
  ): Promise<Observable<UpdateCartResponse>> {
    const userId = req.user;
    const payload = {
      ...body,
      userId: userId,
    };
    return this.svc.updateCart(payload);
  }

  /**
   * @author Apurv
   * @description This function will used by user to get list of product which are added in their cart
   */
  @ApiOperation({ summary: 'Get Cart details' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('getCartDetails')
  private async getCart(
    @Req() req: any,
  ): Promise<Observable<GetCartItemResponse>> {
    const userId = req.user;
    return this.svc.getCartDetails({ userId: userId });
  }

  /**
   * @author Apurv
   * @description This function will used by user to get their order details
   */
  @ApiOperation({ summary: 'Get order details' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('getOrderDetails')
  private async getOrderDetails(
    @Req() req: any,
  ): Promise<Observable<GetOrderDetailsResponse>> {
    const userId = req.user;
    return this.svc.getOrderDetails({ userId: userId });
  }
}
