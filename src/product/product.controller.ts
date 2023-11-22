import { Controller, Get, Inject, OnModuleInit, Param, ParseIntPipe, UseGuards, Post, Body,Request, Req } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable, from } from 'rxjs';
import {
  FindOneResponse,
  ProductServiceClient,
  PRODUCT_SERVICE_NAME,
  CreateProductResponse,
  CreateProductRequest,
  SearchProductResponse,
  UpdateProductRequest,
  UpdateProductResponse,
} from './product.pb';
import { AuthGuard } from '../auth/auth.guard';

@Controller('product')
export class ProductController implements OnModuleInit {
  private svc: ProductServiceClient;

  @Inject(PRODUCT_SERVICE_NAME)
  private readonly client: ClientGrpc;

  public onModuleInit(): void {
    this.svc = this.client.getService<ProductServiceClient>(PRODUCT_SERVICE_NAME);
  }

  @UseGuards(AuthGuard)
  @Post()
  private async createProduct(@Body() body: CreateProductRequest, @Req() req:any): Promise<Observable<CreateProductResponse>> {
    const createProduct:CreateProductRequest = {
      ...body,
      userId: req.user
    }
    return this.svc.createProduct(createProduct);
  }


  @UseGuards(AuthGuard)
  @Get(':id')
  private async findOne(@Param('id') id: string): Promise<Observable<FindOneResponse>> {
    return this.svc.findOne({ id });
  }

  @Get('searchProduct/:name')
  private async searchProduct(@Param('name') name:string):Promise<Observable<SearchProductResponse>>{
     const response:Observable<SearchProductResponse> = this.svc.searchProduct({name});
     return response;
  }


  @UseGuards(AuthGuard)
  @Post('updateProduct')
  private async updateProduct(@Body() body:UpdateProductRequest, @Req() req:any):Promise<Observable<UpdateProductResponse>> {
    const userId = req.user;
    const payload = {
      ...body,
      userId: userId,
    }
    return this.svc.updateProduct(payload);
  }

}