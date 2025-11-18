const { EntitySchema } = require('typeorm');

const ProjectUser = new EntitySchema({
  name: 'ProjectUser',
  tableName: 'project_users',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid',
    },
    role: {
      type: 'varchar',
      length: 50,
    },
    created_at: {
      type: 'timestamp',
      createDate: true,
    },
  },
  relations: {
    project: {
      type: 'many-to-one',
      target: 'Project',
      joinColumn: { name: 'project_id' },
      onDelete: 'CASCADE',
    },
    user: {
      type: 'many-to-one',
      target: 'User',
      joinColumn: { name: 'user_id' },
      onDelete: 'CASCADE',
    },
  },
});

module.exports = { ProjectUser };
