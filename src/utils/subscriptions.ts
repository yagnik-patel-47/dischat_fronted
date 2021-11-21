import { gql } from "@apollo/client";

const NEW_MESSAGE_SUB = gql`
  subscription ($chatId: ID!) {
    newMessage(chatId: $chatId) {
      message
      sender
      timestamp
      chatId
    }
  }
`;

const DELETE_MSG_SUB = gql`
  subscription ($chatId: ID!) {
    deleteMessage(chatId: $chatId) {
      message {
        message
      }
      index
    }
  }
`;

const NEW_CHAT_SUB = gql`
  subscription ($userId: ID!) {
    newChat(userId: $userId) {
      chatId
    }
  }
`;

export { NEW_MESSAGE_SUB, DELETE_MSG_SUB, NEW_CHAT_SUB };
