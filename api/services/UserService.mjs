import User from '../models/Users.mjs';

class UserService {
  async getUserById(userId) {
    try {
      let user = await User.findById(userId);
      delete(user.password);
      delete(user.password_date);
      
      return user;
    } catch (error) {
      throw new Error(`Error fetching invoice: ${error.message}`);
    }
  }
}
export default new UserService(); // Exporting an instance of the class
