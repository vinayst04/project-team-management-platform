const { EntitySchema } = require('typeorm');

const Project = new EntitySchema({
  name: 'Project',
  tableName: 'projects',
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
    description: {
      type: 'text',
      nullable: true,
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
      inverseSide: 'project',
    },
  },
});

module.exports = { Project };
