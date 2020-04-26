const { Model } = require('objection');
const Knex = require('knex');

module.exports = async function main(opts) {

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

  const Obj = require('../models/'+opts.key);
  const u = await Obj.query()
    .modify(function(queryBuilder) {
      if (opts.id) {
        queryBuilder.where(Obj.idColumn, opts.id);
      }
      if (opts.conditions)
        for (let a in opts.conditions) {
          queryBuilder.where(a, opts.conditions[a]);
        }
      if (opts.view)
        queryBuilder
          // .allowGraph(Obj.views[view])
          .withGraphFetched(Obj.graphs[opts.view]);
    })

  knex.destroy()

  return u;
}