import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Conversation {
  id: string;
  other_user: {
    id: string;
    username: string;
    display_name?: string;
    avatar_url?: string;
  };
  last_message?: string;
  last_message_at?: string;
  unread_count: number;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  image_url?: string;
  created_at: string;
  read: boolean;
}

interface ChatState {
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  hasNew: boolean;
}

const initialState: ChatState = {
  conversations: [],
  messages: {},
  hasNew: false,
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setConversations(state, action: PayloadAction<Conversation[]>) {
      state.conversations = action.payload;
    },
    setMessages(state, action: PayloadAction<{ conversationId: string; messages: Message[] }>) {
      state.messages[action.payload.conversationId] = action.payload.messages;
    },
    addMessage(state, action: PayloadAction<{ conversationId: string; message: Message }>) {
      const msgs = state.messages[action.payload.conversationId] ?? [];
      state.messages[action.payload.conversationId] = [...msgs, action.payload.message];
    },
    setHasNew(state, action: PayloadAction<boolean>) {
      state.hasNew = action.payload;
    },
    clearNew(state) {
      state.hasNew = false;
    },
    clearChat(state) {
      state.conversations = [];
      state.messages = {};
      state.hasNew = false;
    },
  },
});

export const { setConversations, setMessages, addMessage, setHasNew, clearNew, clearChat } = chatSlice.actions;
export default chatSlice.reducer;
