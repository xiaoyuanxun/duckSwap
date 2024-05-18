// src/entity/User.ts
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  address!: string;

  @Column()
  TokenList!: string[];

  @Column()
  Balance!: string;

  @Column()
  age!: number;
}
