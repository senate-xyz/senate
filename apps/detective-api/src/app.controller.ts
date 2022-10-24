import { Controller, Get, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('updateProposals')
  async updateProposals(
    @Query('daoId') daoId : string
  ): Promise<String> {
    return await this.appService.updateProposals(daoId);
  }

  @Post('updateVotes')
  async updateVotes(
    @Query('daoId') daoId : string,
    @Query('userId') userId : string,
  ): Promise<String> {
    return await this.appService.updateVotes(daoId, userId);
  }
}
