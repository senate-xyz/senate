import { Controller, HttpStatus, Logger, Post, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';

@Controller('api')
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

  @Post('updateProposals')
  async updateProposals(
    @Query('daoId') daoId : string,
    @Res() res: Response
  ) {
    await this.appService.updateProposals(daoId);
    res.status(HttpStatus.OK).send();
  }

  @Post('updateVotes')
  async updateVotes(
    @Query('daoId') daoId : string,
    @Query('userId') userId : string,
    @Res() res: Response
  ) {
    await this.appService.updateVotes(daoId, userId);
    res.status(HttpStatus.OK).send();
  }
}
