import { gql } from "@apollo/client";

export const GET_USER = gql`
  query ($email: String!) {
    getUser(email: $email) {
      user {
        email
        username
        _id
        chats
      }
      error {
        message
      }
    }
  }
`;

export const GET_USER_BY_ID = gql`
  query ($Id: ID!) {
    getUserByID(Id: $Id) {
      user {
        email
        username
        _id
      }
      error {
        message
      }
    }
  }
`;

export const GET_USER_CHATS = gql`
  query ($email: String!) {
    getUser(email: $email) {
      user {
        chats
      }
      error {
        message
      }
    }
  }
`;

export const FIND_USER_BY_USERNAME = gql`
  query ($username: String!) {
    findUserByUsername(username: $username) {
      user {
        username
        email
        _id
        chats
      }
      error {
        message
      }
    }
  }
`;

export const GET_ONLY_CHAT_NAME = gql`
  query ($ChatId: ID!) {
    getChat(id: $ChatId) {
      name
    }
  }
`;

export const GET_CHAT = gql`
  query ($ChatId: ID!) {
    getChat(id: $ChatId) {
      name
      _id
      messages {
        message
        sender
        timestamp
        chatId
      }
      users {
        username
      }
    }
  }
`;

export const GET_ALL_CHATS = gql`
  query {
    getAllChats {
      name
      users {
        username
      }
      _id
    }
  }
`;
