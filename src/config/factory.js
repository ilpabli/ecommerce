import enviroment from "./enviroment.js";
import mongoose from "mongoose";

let Users;
let Products;
let Carts;
let Chats;
switch (enviroment.PERSISTENCE.toLowerCase()) {
  case "filesystem":
    const { default: UserFileDAO } = await import(
      "../user/dao/userFile.dao.js"
    );
    Users = UserFileDAO;
    const { default: ProductFileDAO } = await import(
      "../product/dao/productFile.dao.js"
    );
    Products = ProductFileDAO;

    const { default: CartFileDAO } = await import(
      "../cart/dao/cartFile.dao.js"
    );
    Carts = CartFileDAO;
    const { default: ChatFileDAO } = await import(
      "../chat/dao/chatFile.dao.js"
    );
    Chats = ChatFileDAO;
    console.log("Configuracion FileSystem Cargada con exito");
    break;

  case "mongo":
    mongoose.connect(enviroment.DB);
    const { default: UserMongoDAO } = await import(
      "../user/dao/userMongo.dao.js"
    );
    Users = UserMongoDAO;
    const { default: ProductMongoDao } = await import(
      "../product/dao/productMongo.dao.js"
    );
    Products = ProductMongoDao;

    const { default: CartMongoDAO } = await import(
      "../cart/dao/cartMongo.dao.js"
    );
    Carts = CartMongoDAO;

    const { default: ChatMongoDAO } = await import(
      "../chat/dao/chatMongo.dao.js"
    );
    Chats = ChatMongoDAO;
    console.log("Configuracion MongoDB Cargada con exito");
    break;

  default:
    console.log("no anotaste nada valido");
    break;
}

export { Users, Products, Carts, Chats };
