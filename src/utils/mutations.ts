import { gql } from "@apollo/client";

export const ADD_NEW_USER = gql`
  mutation ($username: String!, $email: String!) {
    createNewUser(username: $username, email: $email) {
      username
      _id
      email
    }
  }
`;

export const CREATE_CHAT = gql`
  mutation ($users: [UserInput!]!, $name: String!) {
    createNewChat(users: $users, name: $name) {
      _id
      users {
        _id
      }
      name
    }
  }
`;

export const NEW_MESSAGE = gql`
  mutation (
    $message: String!
    $timestamp: String!
    $sender: String!
    $chatId: ID!
  ) {
    newMessage(
      message: $message
      timestamp: $timestamp
      sender: $sender
      chatId: $chatId
    ) {
      message
      timestamp
      sender
      chatId
    }
  }
`;

export const DELETE_MESSAGE = gql`
  mutation ($index: Int!, $chatId: ID!) {
    deleteMessage(index: $index, chatId: $chatId)
  }
`;

export const ADD_USER_TO_CHAT = gql`
  mutation ($chatId: ID!, $user: UserInput!) {
    addNewUserToChat(chatId: $chatId, user: $user)
  }
`;

export const LEAVE_CHAT = gql`
  mutation ($chatId: ID!, $userId: ID!) {
    leaveChat(chatId: $chatId, userId: $userId)
  }
`;
