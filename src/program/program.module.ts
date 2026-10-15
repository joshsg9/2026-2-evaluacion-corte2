import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // Para registrar entidades del módulo
import { ProgramService } from './program.service';
import { ProgramController } from './program.controller';
import { Program } from './entities/program.entity'; 
 
@Module({
  controllers: [ProgramController],
  // TODO Reto 1: registra la entidad Program con TypeORM
  // TODO Reto 4: importa lo necesario para poder usar @Auth() en el controlador
  imports: [
    TypeOrmModule.forFeature([Program]), // Reto 1: registra Club -> permite @InjectRepository(Club) (Student lo usamos vía queryRunner.manager)
    UserModule, // Reto 3: sin esto AuthGuard() no encuentra la estrategia "jwt" por defecto
  ],
  providers: [ProgramService],
})
export class ProgramModule {}

