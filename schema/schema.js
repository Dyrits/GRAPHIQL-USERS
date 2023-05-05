const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLID, GraphQLString, GraphQLInt
} = require("graphql");
const {  find } = require("lodash");

const { users } = require("../data/users");

const UserType = new GraphQLObjectType({
  name: "User",
  fields: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt }
  }
});

const RootQueryType = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      resolve(source, args) {
        return find(users, { id: args.id });
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQueryType
});
