module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('users', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 20]
      }
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    phone: {
      type: Sequelize.STRING(20),
      allowNull: true,
      validate: {
        isValidPhone(value) {
          if (value) {
            // Remove all spaces and non-numeric characters for validation
            const cleanedNumber = value.replace(/\s+/g, '').replace(/[^\d]/g, '');
            if (!/^(0|90)?5[0-9]{8}$/.test(cleanedNumber)) {
              throw new Error('Please enter a valid Turkish phone number');
            }
          }
        }
      }
    },
    avatar_url: {
      type: Sequelize.STRING,
      allowNull: true
    },
    role: {
      type: Sequelize.DataTypes.STRING,
      defaultValue: 'user',
      validate: {
        isIn: [['admin', 'user', 'garage_owner']]
      }
    },
    is_admin: {
      type: Sequelize.VIRTUAL,
      get() {
        return this.role === 'admin';
      },
      set(value) {
        this.setDataValue('role', value ? 'admin' : 'user');
      }
    },
    is_verified: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    reset_token: {
      type: Sequelize.STRING,
      allowNull: true
    },
    reset_token_expires: {
      type: Sequelize.DATE,
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

  return User;
}; 