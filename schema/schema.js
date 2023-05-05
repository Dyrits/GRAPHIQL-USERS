const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLID, GraphQLString, GraphQLInt
} = require("graphql");
const axios = require("axios");

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
        return axios.get(`http://localhost:3000/users/${args.id}`).then(({ data }) => data);
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQueryType
});
