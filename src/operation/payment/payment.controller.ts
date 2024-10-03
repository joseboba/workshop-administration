import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ApiTags } from '@nestjs/swagger';
import { ApplyPaymentDto } from './dto/apply-payment.dto';

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
}
