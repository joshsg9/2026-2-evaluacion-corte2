import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Grades } from "./grades.entity";
import { ApiProperty } from "@nestjs/swagger";
import { Program } from "src/program/entities/program.entity";

@Entity()
export class Student {


    @ApiProperty({
        example:"4fcfc5ab-7902-478f-b173-b8f1e751af12",
        description: "Student id (UUID)",
        format: "uuid"
    })
    @PrimaryGeneratedColumn("uuid")
    id:string;

    @ApiProperty({
        example: "Gus Gonzalez",
        description: "Student's name"
    })
    @Column("text")
    name:string;

    @ApiProperty({
        example: 21,
        description: "Student's age",
        nullable: true
    })
    @Column({
        type: "int",
        nullable: true
    })
    age:number;

    @ApiProperty({
        example: "gus@example.com",
        description: "Student's email (unique)",
        format: "email"
    })
    @Column({
        type: "text",
        unique: true
    })
    email:string;

    @ApiProperty({
        example: true,
        description: "Whether the student is active"
    })
    @Column("boolean")
    isActive: boolean;

    @ApiProperty({
        example: "Male",
        description: "Student's gender",
        enum: ["Male", "Female", "Other"]
    })
    @Column("text")
    gender: string;

    @ApiProperty({
        example: ["P.E", "Physics"],
        description: "Student's favorite subjects",
        type: [String]
    })
    @Column({
        type: "text",
        array: true
    })
    favoriteSubjects:string[];

    @ApiProperty({
        example: "gus_gonzalez21",
        description: "Generated from the name (or given nickname) in lowercase plus the age"
    })
    @Column("text")
    nickname: string;

    @ApiProperty({
        description: "Student's grades",
        type: () => [Grades],
        required: false
    })
    @OneToMany(
        ()=> Grades,
        (grade) => grade.student,
        {cascade: true, eager: true}
    )
    grades?: Grades[]

   
    @ManyToOne( // MUCHOS estudiantes pertenecen a UN club (aquí vive la llave foránea "clubId")
        () => Program, // Entidad del otro lado
        (program) => program.members, // Propiedad inversa en Club
        { nullable: true, onDelete: "SET NULL" } // Opcional; si se borra el club, Postgres pone clubId = NULL (el estudiante NO se borra)
    )
    program?: Program; // Club al que pertenece el estudiante (o null si no tiene)

    @BeforeInsert()
    checkNicknameInsert(){
        if(!this.nickname){
            this.nickname = this.name
        }
        this.nickname = this.nickname.toLowerCase()
                        .replaceAll(" ","_")
                        +this.age
    }

    @BeforeUpdate()
    checkNicknameUpdate(){
        this.nickname = this.nickname.toLowerCase()
                        .replaceAll(" ","_")
                        +this.age
    }

}
