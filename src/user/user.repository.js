export default class UserRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async getAll() {
    return await this.dao.getAll();
  }

  async getAllFiltered() {
    return await this.dao.getAllFiltered();
  }

  async getByEmail(email) {
    return await this.dao.getByEmail(email);
  }

  async createUser(userData) {
    return await this.dao.createUser(userData);
  }

  async update2Premium(uid) {
    return await this.dao.update2Premium(uid);
  }

  async updateRole(uid, role) {
    return await this.dao.updateRole(uid, role);
  }

  async updatePassword(email, newpassword) {
    return await this.dao.updatePassword(email, newpassword);
  }

  async requestPassword(user) {
    return await this.dao.requestPassword(user);
  }

  async getById(id) {
    return await this.dao.getById(id);
  }

  async deleteUser(id) {
    return await this.dao.deleteUser(id);
  }

  async deleteInactiveUsers() {
    return await this.dao.deleteInactiveUsers();
  }

  async updateDate(uid) {
    return await this.dao.updateDate(uid);
  }

  async updateDocuments(uid, field, doc) {
    return await this.dao.updateDocuments(uid, field, doc);
  }
}
