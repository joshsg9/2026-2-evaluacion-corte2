
import { Type } from "class-transformer"; // Para convertir cada objeto del arreglo en una instancia de CreateClubDto
import { ArrayNotEmpty, IsArray, ValidateNested } from "class-validator"; // Decoradores de validación
import { CreateProgramDto } from "./create-program.dto"; // Reusamos las reglas de un solo club

export class BulkCreateProgramDto {

    @IsArray() // clubs debe ser arreglo
    @ArrayNotEmpty() // no vacío
    @ValidateNested({ each: true }) // valida CADA objeto con las reglas de CreateClubDto
    @Type(() => CreateProgramDto) // SIN esto, ValidateNested no sabe qué clase usar y no valida nada
    programs: CreateProgramDto[]; // Lista de clubes a crear
}
