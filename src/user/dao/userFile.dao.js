import fs from "fs";

export default class UserFileDAO {
  constructor() {
    this.path = "./src/user/dao/users.json";
    if (!fs.existsSync(this.path)) {
      fs.writeFileSync(this.path, JSON.stringify([]));
      console.log("Cree el archivo vacio");
    }
    this.users = [];
    this.loadUsers();
  }

  async getAll() {
    return this.users.map((user) => ({ ...user }));
  }

  async getByEmail(email) {
    return this.users.find((user) => user.email === email);
  }

  async createUser(userData) {
    const newUser = { ...userData, _id: Date.now().toString() };
    this.users.push(newUser);
    await this.saveUsers();
    return newUser;
  }

  async updateRole(email, field) {
    const user = this.users.find((user) => user.email === email);
    if (!user) return null;

    user.role = field.role;
    await this.saveUsers();
    return user;
  }

  async getById(id) {
    return this.users.find((user) => user._id === id);
  }

  loadUsers() {
    try {
      const data = fs.readFileSync(this.path, "utf-8");
      this.users = JSON.parse(data);
    } catch (error) {
      this.users = [];
    }
  }

  async saveUsers() {
    const jsonData = JSON.stringify(this.users, null, 2);
    try {
      await fs.promises.writeFile(this.path, jsonData, "utf-8");
    } catch (error) {
      throw new Error("Failed to save users to filesystem.");
    }
  }
}
