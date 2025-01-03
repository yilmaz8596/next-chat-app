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

// For the usersData object which uses dynamic keys
interface UsersData {
  [key: string]: User; // dynamic key (user.id) with User value
}

// For the chatroom data
interface ChatroomData {
  id?: string; // optional for new chatrooms
  users: string[]; // array of user IDs
  usersData: UsersData;
  timestamp: any; // or use proper Firebase timestamp type
  lastMessage: string | null;
}

// Specific type for userData sent to chatroom
interface UserData extends User {
  myData?: User | null;
  otherData?: User | null;
  id?: string | null;
}

// Selected chatroom data structure (used in openChat)
interface SelectedChatData {
  id: string;
  myData: User;
  otherData: User;
}

// Component props interface
interface UsersProps {
  users: User[];
  userData: UserData | null;
  setSelectedChatRoom: (data: SelectedChatData) => void;
  selectedChatRoom?: SelectedChatData | null;
}

interface Message {
  id: string;
  senderId: string; // Make sure this matches the ID format you're using
  content: string;
  time: string;
  timestamp: any;
  avatar: string;
  chatRoomId: string;
  receiverId: string;
}

interface MessageData {
  chatRoomId: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: any; // or use FirebaseFirestore.Timestamp
  avatar: string;
  time?: string; // Add this for displaying time
}
