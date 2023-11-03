import config from "../config/config.js";

export default class PersistenceFactory {

    static getPersistence = async () => {

        let ProductsDao;

        let CartsDao;

        let UsersDao;

        let TicketsDao;

        let MessagesDao;

        switch(config.app.PERSISTENCE){

            case "MONGO": {

                ProductsDao = (await import ("./mongo/ProductsDao.js")).default;

                CartsDao = (await import ("./mongo/CartsDao.js")).default;

                UsersDao = (await import ("./mongo/UsersDao.js")).default;

                TicketsDao = (await import ("./mongo/TicketsDao.js")).default;

                MessagesDao = (await import ("./mongo/MessagesDao.js")).default;

                break;
            }

            // FALTA DESARROLLAR LOS CARTSDAO Y LOS USERSDAO y TERMINAR DE ADAPTAR EL PRODUCTSDAO (SE DEJA EL CÓDIGO
            // PARA QUE SE PUEDA REVISAR LA INICIALIZACIÓN CON FS, SOLO A MODO EDUCATIVO, DESARROLLAR LA LÓGICA DE 
            // ALMACENAMIENTO EN LOCAL EXCEDE LO SOLICITADO)

            case "FS": {

                ProductsDao = (await import ("./filesystem/ProductsDao.js")).default;

                CartsDao = (await import ("./filesystem/CartsDao.js")).default;

                UsersDao = (await import ("./filesystem/UsersDao.js")).default;

                TicketsDao = (await import ("./filesystem/TicketsDao.js")).default;

                MessagesDao = (await import ("./filesystem/MessagesDao.js")).default;

                break;
            }
            
        }

        return { ProductsDao, CartsDao, UsersDao, TicketsDao, MessagesDao};
        
    }

}