export interface User {
  id?: string;
  email: string;
  userName: string;
  avatar: string;
}

export interface Message {
  id: string;
  sender: string;
  avatar: string;
  content: string;
  time: string;
}
