import {
  Controller,
  Get,
  Inject,
  OnModuleInit,
  Param,
  UseGuards,
  Post,
  Body,
  Req,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import {
  FindOneResponse,
  ProductServiceClient,
  PRODUCT_SERVICE_NAME,
  CreateProductResponse,
  CreateProductRequest,
  SearchProductResponse,
  UpdateProductResponse,
} from './product.pb';
import { AuthGuard } from '../auth/auth.guard';
import { CreateProductRequestDto, UpdateProductDto } from './dto/product.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Products')
@Controller('product')
export class ProductController implements OnModuleInit {
  private svc: ProductServiceClient;

  @Inject(PRODUCT_SERVICE_NAME)
  private readonly client: ClientGrpc;

  public onModuleInit(): void {
    this.svc =
      this.client.getService<ProductServiceClient>(PRODUCT_SERVICE_NAME);
  }

  /**
   * @author Apurv
   * @description This function will used by user to add product for selling
   * @Body CreateProductRequestDto
   * @Payload name, description, stock, price
   */
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a product' })
  @UseGuards(AuthGuard)
  @Post()
  private async createProduct(
    @Body() body: CreateProductRequestDto,
    @Req() req: any,
  ): Promise<Observable<CreateProductResponse>> {
    const createProduct: CreateProductRequest = {
      ...body,
      userId: req.user,
    };
    return this.svc.createProduct(createProduct);
  }

  /**
   * @author Apurv
   * @description This function will used by user to search product by their id
   * @Param id
   */
  @ApiOperation({ summary: 'Search product by Id' })
  @Get(':id')
  private async findOne(
    @Param('id') id: string,
  ): Promise<Observable<FindOneResponse>> {
    return this.svc.findOne({ id });
  }

  /**
   * @author Apurv
   * @description This function will used by user to search product by its name
   * @Param name
   */
  @ApiOperation({ summary: 'Search product by name' })
  @Get('searchProduct/:name')
  private async searchProduct(
    @Param('name') name: string,
  ): Promise<Observable<SearchProductResponse>> {
    const response: Observable<SearchProductResponse> = this.svc.searchProduct({
      name,
    });
    return response;
  }

  /**
   * @author Apurv
   * @description This function will used by seller to update their product
   * @Body UpdateProductDto
   * @Payload productId, name, description, stock, price
   */
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update the product' })
  @UseGuards(AuthGuard)
  @Post('updateProduct')
  private async updateProduct(
    @Body() body: UpdateProductDto,
    @Req() req: any,
  ): Promise<Observable<UpdateProductResponse>> {
    const userId = req.user;
    const payload = {
      ...body,
      userId: userId,
    };
    return this.svc.updateProduct(payload);
  }
}
