import { Module } from '@nestjs/common';
import { ProgramService } from './program.service';
import { ProgramController } from './program.controller';

@Module({
  controllers: [ProgramController],
  // TODO Reto 1: registra la entidad Program con TypeORM
  // TODO Reto 4: importa lo necesario para poder usar @Auth() en el controlador
  imports: [],
  providers: [ProgramService],
})
export class ProgramModule {}
