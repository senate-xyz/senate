import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';

import { DAOHandlerType } from "@prisma/client";
import { updateGovernorBravoProposals } from "./proposals/governorBravoProposals";
import { updateMakerPolls } from "./proposals/makerPolls";
import { updateMakerProposals } from "./proposals/makerProposals";
import { updateSnapshotProposals } from "./proposals/snapshotProposals";
import { updateGovernorBravoVotes } from "./votes/governorBravoVotes";
import { updateMakerPollsVotes } from "./votes/makerPollsVotes";
import { updateMakerVotes } from "./votes/makerVotes";
import { updateSnapshotVotes } from "./votes/snapshotVotes";

import { DAOType as Dao, User } from "@senate/common-types";
import { prisma } from "@senate/database";

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name)

  async updateProposals(daoId : string) {

    let dao : Dao;

    try {
      dao = await prisma.dAO.findFirst({
        where: {
          id: daoId
        },
        include: {
          handlers: true,
          subscriptions: true,
        }
      })

    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException();
    }

    if (!dao) {
      throw new NotFoundException("DAO not found");
    }

    for (let handler of dao.handlers) {
      this.logger.log(`Fetching proposals for ${dao.name}, handler: ${handler.type}`)

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
    }
      
  }

  async updateVotes(daoId : string, userId: string) {
    
    let dao: Dao, user: User;

    try {
      dao = await prisma.dAO.findFirst({
        where: {
          id: daoId
        },
        include: {
          handlers: true,
          subscriptions: true,
        }
      });
  
      user = await prisma.user.findFirst({
        where: {
          id: userId
        }
      }); 

    } catch (err) {
      console.log(err)
      throw new InternalServerErrorException();
    }
    
    if (!dao) {
      throw new NotFoundException("DAO not found");
    }

    if (!user) {
      throw new NotFoundException("User not found");
    }

    this.logger.log(`Updating votes for user ${user.address} in ${dao.name}`)

    for (let handler of dao.handlers) {
      this.logger.log(`Fetching votes for ${dao.name}, user ${user.address}, handler: ${handler.type}`)
      
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
    }
  }
}
