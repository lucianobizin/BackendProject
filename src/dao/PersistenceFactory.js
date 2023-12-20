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

            // -----------------------------------------------------
            
            // CASE "FS"

            // THE CARTSDAO AND THE USERSDAO NEED TO BE DEVELOPED AND THE PRODUCTSDAO FINISHED TO BE FINISHED (THE CODE IS LEFT
            // SO THAT THE INITIALIZATION CAN BE REVIEWED WITH FS, ONLY FOR AN EDUCATIONAL WAY, DEVELOP THE LOGIC OF
            // LOCAL STORAGE EXCEEDS WHAT IS REQUESTED HERE)
            
            // -----------------------------------------------------

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