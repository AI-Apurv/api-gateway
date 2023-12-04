import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import {
  AddCartRequest,
  CreateOrderRequest,
  UpdateCartRequest,
} from '../order.pb';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

export class CreateOrderRequestDto implements CreateOrderRequest {
  @ApiHideProperty()
  @IsString()
  public userId: string;

  @ApiHideProperty()
  @IsString()
  email: string;
}

export class AddCartDto implements AddCartRequest {
  @ApiProperty({ example: '655df4f37194b5cbf36867c6' })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ example: '2' })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @ApiHideProperty()
  userId: string;
}

export class UpdateCartDto implements UpdateCartRequest {
  @ApiProperty({ example: '655df4f37194b5cbf36867c6' })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ example: '2' })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @ApiHideProperty()
  userId: string;
}
