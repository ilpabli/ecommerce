import { userModel } from "../model/user.model.js";
import { cartModel } from "../../cart/model/cart.model.js";
import CustomErrors from "../../utils/customErrors.js";
import { updateRoleError, updateUserErrorInfo } from "../../utils/info.js";
import Errors from "../../utils/Errors.js";
import { generateToken } from "../../middleware/jwt.middleware.js";
import MailingService from "../../mailing/mailing.service.js";

export default class UserMongoDAO {
  constructor() {
    this.model = userModel;
    this.mailingService = new MailingService();
  }

  async getAll() {
    return await this.model.find().lean();
  }

  async getAllFiltered() {
    const list = await this.model.find();
    const newList = [];
    list.forEach((eLe) => {
      const user = {
        full_name: eLe.first_name + " " + eLe.last_name,
        email: eLe.email,
        role: eLe.role,
      };
      newList.push(user);
    });
    return newList;
  }

  async getByEmail(email) {
    return await this.model.findOne({ email: email }).populate("cart").lean();
  }

  async createUser(userData) {
    return await this.model.create(userData);
  }

  async update2Premium(uid) {
    const user = await this.model.findOne({ _id: uid });
    if (user.role === "user" && user.documents.length === 3) {
      return await this.model.updateOne({ _id: uid }, { role: "premium" });
    }
    if (user.role === "premium") {
      return await this.model.updateOne({ _id: uid }, { role: "user" });
    } else {
      CustomErrors.createError(
        "Te falta documentacion para poder ser Premium",
        updateRoleError(user.email),
        "Te falta documentacion para poder ser Premium",
        Errors.INVALID_TYPE
      );
    }
  }

  async updateRole(uid, role) {
    return await this.model.updateOne({ _id: uid }, { role: role });
  }

  async updatePassword(email, newpassword) {
    return await this.model.updateOne(
      { email: email },
      { password: newpassword }
    );
  }

  async getById(id) {
    return await this.model.findById(id).populate("cart").lean();
  }

  async requestPassword(user) {
    const validUser = await this.model
      .findOne({ email: user })
      .populate("cart")
      .lean();
    if (!validUser) {
      CustomErrors.createError(
        "El usuario ingresado no es valido!",
        updateUserErrorInfo(user),
        "El usuario ingresado no es valido!",
        Errors.INVALID_TYPE
      );
    }
    const token = generateToken(validUser);
    const recoveryLink = `http://127.0.0.1:8080/renewpassword?email=${user}&token=${token}`;
    const mailOptions = {
      from: "Request <gonzalez.e.pablo@gmail.com>",
      to: user,
      subject: "Recuperacion de password",
      html: `En el siguiente enlance podras generar una nueva password <br> ${recoveryLink}`,
    };
    this.mailingService.sendMail(mailOptions);
    return validUser;
  }

  async deleteUser(id) {
    const user = await this.model.findById(id).lean();
    const cart = await cartModel.deleteOne({ _id: user.cart[0] });
    return this.model.deleteOne({ _id: id });
  }

  async deleteInactiveUsers() {
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    const inactiveUsers = await this.model.find({
      last_connection: { $lt: twoDaysAgo },
    });
    const deletePromises = inactiveUsers.map(async (user) => {
      const mailOptions = {
        from: "Delete User <gonzalez.e.pablo@gmail.com>",
        to: user.email,
        subject: "Se eliminó tu cuenta por inactividad",
        html: `Debido a que estuviste más de 2 días inactivo, eliminamos de nuestra DB tu cuenta. <br> Si quieres volver a formar parte, te esperamos con los brazos abiertos.`,
      };
      this.mailingService.sendMail(mailOptions);
      await this.model.deleteOne({ _id: user._id });
      await cartModel.deleteOne({ _id: user.cart[0] });
      return { email: user.email };
    });
    const deletedUsers = await Promise.all(deletePromises);
    return deletedUsers;
  }

  async updateDate(uid) {
    return await this.model.updateOne(
      { _id: uid },
      { last_connection: new Date() }
    );
  }

  async updateDocuments(uid, field, doc) {
    const user = await userModel.findOne({ _id: uid });
    const tipe = field.tipo;
    const file = doc.document[0];
    const indexToUpdate = user.documents.findIndex(
      (document) => document.tipe === tipe
    );

    if (indexToUpdate !== -1) {
      user.documents[indexToUpdate] = {
        name: file.filename,
        reference: file.path,
        tipe: tipe,
      };
    } else {
      user.documents.push({
        name: file.filename,
        reference: file.path,
        tipe: tipe,
      });
    }
    await user.save();
    return user;
  }
}
