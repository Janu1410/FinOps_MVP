import Client from './Client.js';
import User from './User.js';
import Billing from './Billing.js';
import Inquiry from './Inquiry.js';

// Define associations AFTER both models are imported
Client.hasMany(User, { foreignKey: 'client_id', as: 'users' });
User.belongsTo(Client, { foreignKey: 'client_id', as: 'client' });

export { Client, User , Billing , Inquiry };
