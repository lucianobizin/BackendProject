export default class UsersRepository {

    constructor(dao) {

        this.dao = dao
    }

    // getUserBy(param){
    //     return this.dao.getUserBy(param);
    // }

    getUserBy(param){
        return this.dao.getBy(param);
    }

    createUser(newUser){
        return this.dao.create(newUser)
    }

}