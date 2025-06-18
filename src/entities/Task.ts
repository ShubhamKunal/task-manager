import {Entity, PrimaryGeneratedColumn, Column} from 'typeorm';

@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    id: number | undefined;

    @Column({ type: 'varchar', length: 100 })
    name: string | undefined;

    @Column({ type: 'varchar', length: 500 })
    description: string | undefined;

    @Column({ type: 'boolean', default: false })
    completed: boolean | undefined;
}