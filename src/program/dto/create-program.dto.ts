import { IsInt, IsOptional, IsPositive, IsString, Max, MaxLength, Min, MinLength } from "class-validator"; // Decoradores de validación

export class CreateProgramDto {

    @IsString() // name debe ser string
    @MinLength(3) // y tener mínimo 3 caracteres
    name: string; // Nombre del club

    @IsString() // si viene, debe ser string
    @MinLength(3)
    @MaxLength(6)
    code: string; // Descripción opcional

    @IsInt()
    @IsPositive()
    credits: number; // Cupo máximo
}
