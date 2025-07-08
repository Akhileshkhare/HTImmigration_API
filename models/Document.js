const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Document = sequelize.define('Document', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: DataTypes.INTEGER,
  file_name: DataTypes.STRING,
  file_path: DataTypes.STRING,
  uploaded_by: DataTypes.STRING,
  uploaded_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  is_archived: { type: DataTypes.BOOLEAN, defaultValue: false },
  evaluation_id: DataTypes.INTEGER,
}, {
  tableName: 'documents',
  timestamps: false,
});

module.exports = Document;
