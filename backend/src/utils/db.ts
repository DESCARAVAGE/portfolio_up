import * as dotenv from "dotenv";
import 'reflect-metadata';
import { DataSource } from "typeorm";
import { Cv } from "../entities/cv-entities";

dotenv.config();

const isDevelopment = process.env.NODE_ENV !== 'production';

export const dataSource = new DataSource({
  type: "postgres",
  host: process.env.HOST,
  port: Number.parseInt(process.env.DB_PORT as string),
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,

  synchronize: false, //false en prod ou si tu utilise les migrations
  logging: true,

  entities: [Cv],
  migrations: isDevelopment
    ? ["src/migrations/**/*.ts"]
    : [__dirname + "/../migrations/**/*.js"],
});