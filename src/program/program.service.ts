import { Program } from './entities/program.entity';
import { BadRequestException, ConflictException, ForbiddenException, HttpException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common'; // Excepciones HTTP y Logger
import { InjectRepository } from '@nestjs/typeorm'; // Para inyectar repositorios
import { DataSource, EntityManager, In, Repository } from 'typeorm'; // DataSource (QueryRunner), EntityManager (tipo), In (WHERE ... IN (...)), Repository
import { isEmail, isUUID } from 'class-validator'; // Funciones sueltas para validar email y UUID
import { Student } from '../student/entities/student.entity'; // Entidad Student
import { User } from '../user/entities/user.entity'; // Entidad User
import { ValidRoles } from '../user/enums/valid-roles.enum'; // Enum de roles
import { CreateProgramDto } from './dto/create-program.dto'; // DTO crear
import { BulkCreateProgramDto } from './dto/bulk-create-program.dto'; // DTO crear varios
import { PaginationDto } from '../student/dto/pagination.dto'; // DTO paginación

@Injectable()
export class ProgramService {

    private readonly logger = new Logger('ProgramService'); // Logger para errores

    constructor(
        @InjectRepository(Program) // Repositorio de Club
        private readonly programRepository: Repository<Program>, // CRUD de clubes
        private readonly dataSource: DataSource, // Para crear QueryRunners (transacciones)
    ) {}

    // TODO Reto 1: inyecta el repositorio de Program (y lo que necesites para las transacciones)

    // TODO Reto 1: create(createProgramDto, user) -> guarda el programa
    //   - nombre o código repetido -> 409 Conflict (no 500)

    // TODO Reto 1: findAll(paginationDto) -> lista paginada (limit / skip)

    // TODO Reto 2: findOne(id) -> programa con sus estudiantes, 404 si no existe

    // TODO Reto 2: assignStudents(id, assignStudentsDto) -> AGREGA estudiantes al programa
    //   dentro de una transacción (QueryRunner), conservando los que ya tenía.
    //   Mismo patrón del update de estudiantes corregido en clase (combinar las notas):
    //   traer los actuales -> combinar con los nuevos -> guardar la lista completa.
    //   Si algún id no existe: 404 y rollback.

    // TODO Reto 3: bulkCreate(bulkCreateProgramDto, user) -> crea todos los programas o ninguno
    //   (transacción). Cualquier nombre/código repetido -> 409 y rollback.


     // PLURAL - POST /api/club/bulk -> o se crean TODOS o NINGUNO
    async createMany(bulkDto: BulkCreateProgramDto, user: User) { // Lista de clubes + usuario
        const queryRunner = this.dataSource.createQueryRunner(); // QueryRunner nuevo
        await queryRunner.connect(); // Conectar
        await queryRunner.startTransaction(); // BEGIN
        try { // Operaciones
            const programs = bulkDto.programs.map((dto) => queryRunner.manager.create(Program, { ...dto, createdBy: user })); // Arma cada club
            const saved = await queryRunner.manager.save(programs); // INSERT de todos (si uno repite nombre -> 23505)
            await queryRunner.commitTransaction(); // COMMIT
            return saved; // 201 con la lista creada
        } catch (error) { // Si alguno falla
            await queryRunner.rollbackTransaction(); // ROLLBACK -> no queda ninguno
            this.handleException(error); // 23505 -> 409
        } finally { // Siempre
            await queryRunner.release(); // Liberar conexión
        }
    }

      private handleException(error: any): never { // never = siempre lanza
        if (error instanceof HttpException) throw error; // 404/400/409/403 se relanzan tal cual
        this.logger.error(error); // Log del error inesperado
        if (error.code === '23505') throw new ConflictException(error.detail); // unique_violation -> 409
        throw new InternalServerErrorException('Unexpected error, check server logs'); // Otro -> 500
    }


}
