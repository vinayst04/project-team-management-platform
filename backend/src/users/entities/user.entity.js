const { EntitySchema } = require('typeorm');

const User = new EntitySchema({
  name: 'User',
  tableName: 'users',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid',
    },
    email: {
      type: 'varchar',
      unique: true,
      length: 255,
    },
    password_hash: {
      type: 'varchar',
      length: 255,
    },
    role: {
      type: 'varchar',
      nullable: true,
      length: 50,
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
    client: {
      type: 'many-to-one',
      target: 'Client',
      joinColumn: { name: 'client_id' },
      onDelete: 'CASCADE',
    },
    projectUsers: {
      type: 'one-to-many',
      target: 'ProjectUser',
      inverseSide: 'user',
    },
  },
});

module.exports = { User };
