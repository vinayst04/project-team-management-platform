const { EntitySchema } = require('typeorm');

const Client = new EntitySchema({
  name: 'Client',
  tableName: 'clients',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid',
    },
    name: {
      type: 'varchar',
      length: 255,
    },
    created_at: {
      type: 'timestamp',
      createDate: true,
    },
    updated_at: {
      type: 'timestamp',
      updateDate: true,
    },
  },
  relations: {
    users: {
      type: 'one-to-many',
      target: 'User',
      inverseSide: 'client',
    },
    projects: {
      type: 'one-to-many',
      target: 'Project',
      inverseSide: 'client',
    },
  },
});

module.exports = { Client };
