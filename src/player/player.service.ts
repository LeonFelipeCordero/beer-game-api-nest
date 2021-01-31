import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Player } from './player.entity';
import { PlayerDTO } from './player.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
  ) {}

  async getOne(id: string): Promise<Player> {
    return this.playerRepository.findOne(id, {
      relations: ['gameSession', 'outgoingOrders', 'incomingOrders'],
    });
  }

  async insertOne(request: PlayerDTO): Promise<Player> {
    const newPlayer = this.playerRepository.create(request);
    return this.playerRepository.save(newPlayer);
  }

  async insertMany(requests: PlayerDTO[]): Promise<Player[]> {
    const newPlayers = this.playerRepository.create(requests);
    return this.playerRepository.save(newPlayers);
  }

  async updateOne(request: PlayerDTO): Promise<Player> {
    const { id } = request;
    return this.playerRepository
      .update({ id }, request)
      .then(() => this.getOne(id));
  }
}
