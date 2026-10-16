import { ProgramService } from './program.service';
import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseBoolPipe, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common'; // Decoradores HTTP y pipes
import { CreateProgramDto } from './dto/create-program.dto'; // Crear uno
import { BulkCreateProgramDto } from './dto/bulk-create-program.dto'; // Crear varios
import { AssignStudentsDto } from './dto/assign-students.dto'; // { emails: [...] }
import { PaginationDto } from '../student/dto/pagination.dto'; // limit / skip
import { Auth } from '../user/decorators/auth.decorator'; // @Auth(...roles): 401 sin token, 403 sin rol
import { GetUser } from '../user/decorators/get-user.decorator'; // Usuario del token
import { ValidRoles } from '../user/enums/valid-roles.enum'; // Roles
import { User } from '../user/entities/user.entity'; // Tipo User

@Controller('program')
export class ProgramController {
  constructor(private readonly programService: ProgramService) {}

  @Post() // SINGULAR: POST /api/club
  @Auth(ValidRoles.admin, ValidRoles.teacher) // admin o teacher
  create(@Body() createProgramDto: CreateProgramDto, @GetUser() user: User) { // body + usuario
  return this.programService.create(createProgramDto, user); // Crea uno
  }

  @Post('bulk') // PLURAL: POST /api/club/bulk  { "clubs": [...] }
  @Auth(ValidRoles.admin, ValidRoles.teacher) // admin o teacher
  createMany(@Body() bulkDto: BulkCreateProgramDto, @GetUser() user: User) { // lista + usuario
  return this.programService.createMany(bulkDto, user); // Crea todos o ninguno
  }
}
