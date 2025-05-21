module.exports = (sequelize, Sequelize) => {
  const Appointment = sequelize.define('appointments', {
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
    user_id: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    service_type: {
      type: Sequelize.STRING,
      allowNull: false
    },
    appointment_date: {
      type: Sequelize.DATEONLY,
      allowNull: false
    },
    appointment_time: {
      type: Sequelize.STRING, // Format: "HH:MM"
      allowNull: false
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'pending',
      validate: {
        isIn: [['pending', 'confirmed', 'completed', 'cancelled']]
      }
    },
    notes: {
      type: Sequelize.TEXT,
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

  return Appointment;
}; 