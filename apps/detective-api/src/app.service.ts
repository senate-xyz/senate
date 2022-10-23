import { Injectable, Logger } from '@nestjs/common';

import { updateGovernorBravoProposals } from "./proposals/governorBravoProposals";
import { updateSnapshotProposals } from "./proposals/snapshotProposals";
import { updateMakerProposals } from "./proposals/makerProposals";
import { updateMakerPolls } from "./proposals/makerPolls";
import { updateSnapshotVotes } from "./votes/snapshotVotes";
import { updateGovernorBravoVotes } from "./votes/governorBravoVotes";
import { updateMakerVotes } from "./votes/makerVotes";
import { updateMakerPollsVotes } from "./votes/makerPollsVotes";
import { DAOHandlerType, ProposalType } from "@prisma/client";

import { DAOType as Dao, DAOHandlerType as DAOHandler, User } from "@senate/common-types";
import { prisma } from "@senate/database";

@Injectable()
export class AppService {

  private readonly logger = new Logger(AppService.name);

  getHello(): string {
    return 'Hello World!';
  }

  async updateProposals(daoId : string): Promise<string> {

    this.logger.log(daoId);
    let dao : Dao = await prisma.dAO.findFirst({
      where: {
        id: daoId
      },
      include: {
        handlers: true,
        subscriptions: true,
      }
    })

    dao.handlers.forEach(async handler => {
      console.log(`Fetching proposals for ${dao.name}, handler: ${handler.type}`)
      switch(handler.type) {
        case DAOHandlerType.SNAPSHOT: 
          await updateSnapshotProposals(dao.name, handler);
          break;
        
        case DAOHandlerType.BRAVO1 || DAOHandlerType.BRAVO2:
          await updateGovernorBravoProposals(handler);
          break;
  
        case DAOHandlerType.MAKER_EXECUTIVE:
          await updateMakerProposals(handler);
          break;
  
        case DAOHandlerType.MAKER_POLL_CREATE:
          await updateMakerPolls(handler);
          break;
  
        default:
          break;    
      }
    })

    
    return 'Hello!';
  }

  async updateVotes(daoId : string, userId: string): Promise<string> {
    
    let dao : Dao = await prisma.dAO.findFirst({
      where: {
        id: daoId
      },
      include: {
        handlers: true,
        subscriptions: true,
      }
    })

    let user : User = await prisma.user.findFirst({
      where: {
        id: userId
      }
    })

    dao.handlers.forEach(async handler => {
      console.log(`Fetching votes for ${dao.name}, user ${user.address}, handler: ${handler.type}`)
      switch(handler.type) {
        case DAOHandlerType.SNAPSHOT: 
          await updateSnapshotVotes(handler, user, dao.name);
          break;
        
        case DAOHandlerType.BRAVO1 || DAOHandlerType.BRAVO2:
          await updateGovernorBravoVotes(handler, user, dao.name);
          break;

        case DAOHandlerType.MAKER_EXECUTIVE:
          await updateMakerVotes(handler, user, dao.name);
          break;

        case DAOHandlerType.MAKER_POLL_VOTE:
          await updateMakerPollsVotes(handler, user, dao.name);
          break;

        default:
          break;
        
      }
    })

    return 'Hello World!';
  }
}
