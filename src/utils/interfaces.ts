export interface Chat {
  id: string;
  users: [Profile];
  messages: [Message];
}

export interface Message {
  message: string;
  sender: string;
  timestamp: Date;
  chatId: string;
}

export interface Profile {
  id: string;
  username: string;
  email: string;
}
