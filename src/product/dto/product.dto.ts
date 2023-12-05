import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import {
  CreateProductRequest,
  FindOneRequest,
  UpdateProductRequest,
} from '../product.pb';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

export class FindOneRequestDto implements FindOneRequest {
  @ApiProperty({ example: '655df4f37194b5cbf36867c6' })
  @IsString()
  public readonly id: string;
}

export class CreateProductRequestDto implements CreateProductRequest {
  @ApiProperty({ example: 'Samsung' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Electronics' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: '100' })
  @IsString()
  stock: number;

  @ApiProperty({ example: '10000' })
  @IsString()
  price: number;

  @ApiProperty({type: 'string', format: 'binary'})
  image:any

  @ApiHideProperty()
  userId: string;
}

export class UpdateProductDto implements UpdateProductRequest {
  @ApiProperty({ example: '655df4f37194b5cbf36867c6' })
  @IsString()
  @IsOptional()
  productId: string;

  @ApiProperty({ example: 'Nokia' })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ example: 'Mobiles' })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({ example: '100' })
  @IsNumber()
  @IsOptional()
  stock: number;

  @ApiProperty({ example: '10000' })
  @IsNumber()
  @IsOptional()
  price: number;

  @ApiProperty({type: 'string', format: 'binary'})
  image:any

  @ApiHideProperty()
  userId: string;
}
