import { BaseEntity, Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from 'src/user/user.entity';

@Entity()
export class Trial extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    optionType: string;

    @Column()
    startDate: Date;

    @Column()
    endDate: Date;

    @Column({ default: 'active' })
    status: string;

    @Column()
    userEmail: string;
}