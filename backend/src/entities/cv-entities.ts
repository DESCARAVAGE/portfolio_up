import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('cv')
export class Cv {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type :'text'})
    filename: string;

    @Column({type: 'text'})
    mimeType: string;

    @Column()
    size: number

    @Column({type: 'text'})
    url: string;

    @CreateDateColumn()
    dateCreated: Date;
}
