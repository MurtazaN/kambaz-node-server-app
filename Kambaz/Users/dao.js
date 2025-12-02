import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export default function UsersDao() {

    const createUser = async (user) => {
        const newUser = { ...user, _id: uuidv4() };
        return await model.create(newUser);
    };
    const findAllUsers = () => model.find(); //db.users;
    const findUserById = (userId) => model.findById(userId); //db.users.find((user) => user._id === userId);
    const findUserByUsername = (username) => model.findOne({ username: username }); //db.users.find((user) => user.username === username);
    const findUserByCredentials = (username, password) => model.findOne({ username, password });
    //     {
    //     if (!db.users) {
    //         return null;
    //     }
    //     return db.users.find((user) => user.username === username && user.password === password);
    // }
    const updateUser = (userId, user) => model.updateOne({ _id: userId }, { $set: user });
    //     userId, user);
    //     {
    //     const currentUser = db.users.find((u) => u._id === userId);
    //     Object.assign(currentUser, user);
    //     return currentUser;
    // };
    const deleteUser = (userId) => model.deleteOne({ _id: userId });
    //     {
    //     db.users = db.users.filter((u) => u._id !== userId);
    //     return db.users;
    // };
    return {
        createUser, findAllUsers, findUserById, findUserByUsername, findUserByCredentials, updateUser, deleteUser
    };
}
