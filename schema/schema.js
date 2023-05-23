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
      resolve({ id }) {
        return json$server.get(`/companies/${id}/users`).then(({ data }) => data);
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
      resolve({ company }) {
        return json$server.get(`/companies/${company}`).then(({ data }) => data);
      }
    }
  })
});

const Query = new GraphQLObjectType({
  name: "Select",
  fields: {
    users: {
      type: new GraphQLList(UserType),
      resolve() {
        return json$server.get("/users").then(({ data }) => data);
      }
    },
    user: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      resolve(_, { id }) {
        return json$server.get(`/users/${id}`).then(({ data }) => data);
      }
    },
    companies: {
      type: new GraphQLList(CompanyType),
      resolve() {
        return json$server.get("/companies").then(({ data }) => data);
      }
    },
    company: {
      type: CompanyType,
      args: { id: { type: GraphQLID } },
      resolve(_, { id }) {
        return json$server.get(`/companies/${id}`).then(({ data }) => data);
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
      resolve(_, user) {
        return json$server.post("/users", user).then(({ data }) => data);
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
      resolve(_, user) {
        return json$server.patch(`/users/${user.id}`, user).then(({ data }) => data);
      }
    },
    deleteUser: {
      type: UserType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(_, { id }) {
        return json$server.delete(`/users/${id}`).then(() => ({ id }));
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: Query,
  mutation: Mutation
});
