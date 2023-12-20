export default class UsersRepository {

    constructor(dao) {

        this.dao = dao;
    }

    getAllUsers(){
        return this.dao.get();
    }

    getUserBy(param){
        return this.dao.getBy(param);
    }

    createUser(newUser){
        return this.dao.create(newUser);
    }

    passwordUpdate = async (id,hashedpassword) =>{
        return await this.dao.update({ _id: id }, { $set: {password: hashedpassword} });
    }

    roleUpdate(uid, roleToUpdate){
        return this.dao.update({ _id: uid }, { $set: {role: roleToUpdate} });
    }

    last_connectionUpdate(uid, last_connection_){
        return this.dao.update({ _id: uid }, { $set: {last_connection: last_connection_} })
    }

    updateUser(uid, newDocument){
        return this.dao.update({ _id: uid }, { $set: {documents: newDocument} })
    }

}