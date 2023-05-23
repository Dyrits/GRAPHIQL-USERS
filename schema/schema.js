const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLID, GraphQLString, GraphQLInt, GraphQLList, GraphQLNonNull
} = require("graphql");

const json$server = require("axios").create({
  baseURL: "http://localhost:3000"
});

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

const Query = new GraphQLObjectType({
  name: "Select",
  fields: {
    users: {
      type: new GraphQLList(UserType),
      resolve(source, args) {
        return json$server.get("/users").then(({ data }) => data);
      }
    },
    user: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      resolve(source, args) {
        return json$server.get(`/users/${args.id}`).then(({ data }) => data);
      }
    },
    companies: {
      type: new GraphQLList(CompanyType),
      resolve(source, args) {
        return json$server.get("/companies").then(({ data }) => data);
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

const Mutation = new GraphQLObjectType({
  name: "UpsertOrDelete",
  fields: {
    insertUser: {
      type: UserType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        company: { type: GraphQLID }
      },
      resolve(source, args) {
        return json$server.post("/users", args).then(({ data }) => data);
      }
    },
    updateUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        company: { type: GraphQLID }
      },
      resolve(source, args) {
        return json$server.patch(`/users/${args.id}`, args).then(({ data }) => data);
      }
    },
    deleteUser: {
      type: UserType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(source, args) {
        return json$server.delete(`/users/${args.id}`).then(({ data }) => data);
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: Query,
  mutation: Mutation
});
