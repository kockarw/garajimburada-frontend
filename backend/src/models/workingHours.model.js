module.exports = (sequelize, Sequelize) => {
  const WorkingHours = sequelize.define('working_hours', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    garage_id: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'garages',
        key: 'id'
      }
    },
    monday_open: {
      type: Sequelize.STRING,
      allowNull: true
    },
    monday_close: {
      type: Sequelize.STRING,
      allowNull: true
    },
    tuesday_open: {
      type: Sequelize.STRING,
      allowNull: true
    },
    tuesday_close: {
      type: Sequelize.STRING,
      allowNull: true
    },
    wednesday_open: {
      type: Sequelize.STRING,
      allowNull: true
    },
    wednesday_close: {
      type: Sequelize.STRING,
      allowNull: true
    },
    thursday_open: {
      type: Sequelize.STRING,
      allowNull: true
    },
    thursday_close: {
      type: Sequelize.STRING,
      allowNull: true
    },
    friday_open: {
      type: Sequelize.STRING,
      allowNull: true
    },
    friday_close: {
      type: Sequelize.STRING,
      allowNull: true
    },
    saturday_open: {
      type: Sequelize.STRING,
      allowNull: true
    },
    saturday_close: {
      type: Sequelize.STRING,
      allowNull: true
    },
    sunday_open: {
      type: Sequelize.STRING,
      allowNull: true
    },
    sunday_close: {
      type: Sequelize.STRING,
      allowNull: true
    },
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    },
    updated_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    }
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return WorkingHours;
}; 