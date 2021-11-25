import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type Note {
    id: String
    title: String
    description: String
    category: String
    creatorId: String
  }

  type Query {
    notes: [Note]!
  }
`;
