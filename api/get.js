const { Model } = require('objection');
const Knex = require('knex');

module.exports = async function main(key, id, view, conditions) {


  // Initialize knex.
  const knex = Knex({
    client: 'mysql',
    useNullAsDefault: true,
    connection: {
      host : '127.0.0.1',
      user : 'root',
      password : 'frosting',
      database : 'formulate'
    }
  });

  // Give the knex instance to objection.
  Model.knex(knex);

  const Obj = require('../models/'+key);
  // const relations = Object.keys(Obj.relationMappings);
  const u = await Obj.query()
    .modify(function(queryBuilder) {
      if (id) {
        queryBuilder.where(Obj.idColumn, id);
      }
      if (conditions)
        for (let a=0; a<conditions.length; a++) {
          queryBuilder.where(conditions[a][0], conditions[a][1]);
        }
      if (view)
        queryBuilder
          // .allowGraph(Obj.views[view])
          .withGraphFetched(Obj.graphs[view]);
    })

  knex.destroy()

  return u;
}