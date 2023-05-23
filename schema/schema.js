const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLID, GraphQLString, GraphQLInt, GraphQLList
} = require("graphql");

const json$server = require("axios").create({
  baseURL: "http://localhost:3000"
})

const CompanyType = new GraphQLObjectType({
  name: "Company",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    users: {
      type: new GraphQLList(UserType),
      resolve(source, args) {
        return json$server.get(`/companies/${source.id}/users`).then(({ data }) => data);
      }
    }
  })
});

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    company: {
      type: CompanyType,
      resolve(source, args) {
        return json$server.get(`/companies/${source.company}`).then(({ data }) => data);
      }
    }
  })
});

const RootQueryType = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      resolve(source, args) {
        return json$server.get(`/users/${args.id}`).then(({ data }) => data);
      }
    },
    company: {
      type: CompanyType,
      args: { id: { type: GraphQLID } },
      resolve(source, args) {
        return json$server.get(`/companies/${args.id}`).then(({ data }) => data);
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQueryType
});
