import { ArrayNotEmpty, IsArray, IsEmail } from "class-validator"; // Decoradores de validación

export class AssignStudentsDto {

    @IsArray() // emails debe ser un arreglo
    @ArrayNotEmpty() // y NO puede estar vacío ([] -> 400)
    @IsEmail({}, { each: true }) // { each: true } valida CADA elemento del arreglo como email
    emails: string[]; // Lista de correos de estudiantes
}
