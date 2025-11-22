import { v4 as uuidv4 } from "uuid";

export default function UsersDao(db) {

    const createUser = (user) => {
        const newUser = { ...user, _id: uuidv4() };
        db.users.push(newUser);
        return newUser;
    };
    const findAllUsers = () => db.users;
    const findUserById = (userId) => db.users.find((user) => user._id === userId);
    const findUserByUsername = (username) => db.users.find((user) => user.username === username);
    const findUserByCredentials = (username, password) => {
        if (!db.users) {
            return null;
        }
        return db.users.find((user) => user.username === username && user.password === password);
    }
    const updateUser = (userId, user) => {
        const currentUser = db.users.find((u) => u._id === userId);
        Object.assign(currentUser, user);
        return currentUser;
    };
    const deleteUser = (userId) => {
        db.users = db.users.filter((u) => u._id !== userId);
        return db.users;
    };
    return {
        createUser, findAllUsers, findUserById, findUserByUsername, findUserByCredentials, updateUser, deleteUser
    };
}
