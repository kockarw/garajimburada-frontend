module.exports = {
  up: async (queryInterface, Sequelize) => {
    // First create the ENUM type
    await queryInterface.sequelize.query(
      `CREATE TYPE "enum_garages_status" AS ENUM ('approved', 'pending', 'rejected', 'inactive');`
    );

    // Add status column
    await queryInterface.addColumn('garages', 'status', {
      type: Sequelize.ENUM('approved', 'pending', 'rejected', 'inactive'),
      defaultValue: 'pending',
      allowNull: false
    });

    // Add rejection_reason column
    await queryInterface.addColumn('garages', 'rejection_reason', {
      type: Sequelize.TEXT,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove columns
    await queryInterface.removeColumn('garages', 'rejection_reason');
    await queryInterface.removeColumn('garages', 'status');
    
    // Drop the ENUM type
    await queryInterface.sequelize.query(
      `DROP TYPE "enum_garages_status";`
    );
  }
}; 