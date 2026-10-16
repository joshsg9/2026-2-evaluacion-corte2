import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm"; // Importamos los decoradores de TypeORM que vamos a usar
import { Student } from "../../student/entities/student.entity"; // Importamos Student para la relación 1:N (un club tiene muchos estudiantes)
import { User } from "../../user/entities/user.entity"; // Importamos User para la relación N:1 (quién creó el club)

@Entity("program") // Le dice a TypeORM que esta clase es una tabla llamada "club" (synchronize: true la crea sola)
export class Program {

    @PrimaryGeneratedColumn("uuid") // Llave primaria; PostgreSQL genera un UUID automáticamente al insertar
    id: string; // Columna id de tipo UUID

    @Column({ // Columna normal con opciones
        type: "text", // Tipo text en PostgreSQL
        unique: true, // Restricción UNIQUE: si se repite el nombre, Postgres lanza el error 23505 (lo convertimos en 409)
    })
    name: string; // Nombre del club

    @Column({ // Columna con opciones
        type: "text", // Tipo text
        unique: true, 
    })
    code: string; 

    @Column("int") // Columna entera
    credits: number; 

    // ---------- Reto 2: relación 1:N con Student ----------
    @OneToMany( // Un programa tiene MUCHOS estudiantes
        () => Student, // Entidad del otro lado de la relación (función para evitar problemas de import circular)
        (student) => student.program, 
    )
    members?: Student[]; // Arreglo de miembros; la llave foránea (clubId) vive en la tabla student, no aquí

    // ---------- Reto 3: relación N:1 con User ----------
    @ManyToOne( // Muchos programs pueden ser creados por UN usuario
        () => User, // Entidad relacionada
        { eager: false, nullable: true, onDelete: "SET NULL" }, // No se carga sola; si se borra el usuario, createdBy queda en NULL
    )
    createdBy?: User; // TypeORM crea la columna "createdById" en la tabla club
}
