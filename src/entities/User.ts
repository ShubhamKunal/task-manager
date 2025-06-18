import {Entity, PrimaryGeneratedColumn, Column} from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number | undefined;

    @Column({ type: 'varchar', length: 100 })
    name: string | undefined;

    @Column({ type: 'int', default: 0 })
    age: number | undefined;

    @Column({ type: 'varchar', default: 'male' })
    gender: string | undefined;

    @Column({ type: 'varchar', length: 100 })
    email: string | undefined;

    @Column({ type: 'varchar', length: 100 })
    password: string | undefined;
    
}