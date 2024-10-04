import { Body, Controller, Get, HttpStatus, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApplyPaymentDto } from './dto/apply-payment.dto';
import { Pago } from './entities/pago.entity';

@Controller('payment')
@ApiTags('Pagos')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('describe/:ortCodigo')
  describeTotal(@Param('ortCodigo', ParseIntPipe) ortCodigo: number) {
    return this.paymentService.describeTotal(ortCodigo);
  }

  @Post('apply')
  applyPayment(@Body() applyPaymentDto: ApplyPaymentDto) {
    return this.paymentService.applyPayment(applyPaymentDto);
  }

  @Get('history')
  @ApiResponse({
    status: HttpStatus.OK,
    type: Pago,
    isArray: true,
  })
  paymentHistory(@Query('ortCodigo', ParseIntPipe) ortCodigo: number) {
    return this.paymentService.historyPayment(ortCodigo);
  }
}
