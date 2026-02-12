import * as dotenv from "dotenv";
import 'reflect-metadata';
import { DataSource } from "typeorm";

dotenv.config();

export const dataSource = new DataSource({
  type: "postgres",
  host: process.env.HOST,
  port: parseInt(process.env.DB_PORT as string),
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,

  synchronize: false, //false en prod ou si tu utilise les migrations
  logging: true,

  entities: ["src/entities/*.{ts,js}"],
  migrations: ["src/migrations/*.{ts,js}"],
});