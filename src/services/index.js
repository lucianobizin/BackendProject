import PersistenceFactory from "../dao/PersistenceFactory.js";

import ProductsRepository from "./repositories/ProductsRepository.js";
import CartsRepository from "./repositories/CartsRepository.js";
import UsersRepository from "./repositories/UsersRepository.js";
import TicketsRepository from "./repositories/TicketsRepository.js";
import MessagesRepository from "./repositories/MessagesRepository.js"

const {ProductsDao, CartsDao, UsersDao, TicketsDao, MessagesDao} = await PersistenceFactory.getPersistence()

export const productsService = new ProductsRepository(new ProductsDao());
export const cartsService = new CartsRepository(new CartsDao());
export const usersService = new UsersRepository(new UsersDao());
export const ticketsService = new TicketsRepository(new TicketsDao());
export const messagesService = new MessagesRepository(new MessagesDao());