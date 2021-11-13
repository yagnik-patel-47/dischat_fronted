export interface Chat {
  id: string;
  users: [Profile];
  messages: [Message];
}

export interface Message {
  message: string;
  sender: string;
  timestamp: Date;
}

export interface Profile {
  id: string;
  username: string;
  email: string;
}
