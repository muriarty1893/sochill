import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Post {
  id: string;
  user_id: string;
  body: string;
  image_url?: string;
  image_width?: number;
  image_height?: number;
  created_at: string;
  profiles?: {
    id: string;
    username: string;
    handle: string;
    display_name?: string;
    avatar_url?: string;
    verified?: boolean;
  };
  likes_count?: number;
  comments_count?: number;
  reposts_count?: number;
  is_liked?: boolean;
  is_reposted?: boolean;
  reposted_by?: { id: string; username: string; display_name?: string; avatar_url?: string } | null;
  reposted_at?: string;
}

interface PostsState {
  data: Post[];
  loading: boolean;
}

const initialState: PostsState = {
  data: [],
  loading: false,
};

export const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setPosts(state, action: PayloadAction<Post[]>) {
      state.data = action.payload;
    },
    addPosts(state, action: PayloadAction<Post[]>) {
      const existing = new Set(state.data.map((p) => p.id));
      const newPosts = action.payload.filter((p) => !existing.has(p.id));
      state.data = [...state.data, ...newPosts];
    },
    prependPost(state, action: PayloadAction<Post>) {
      state.data = [action.payload, ...state.data];
    },
    removePost(state, action: PayloadAction<string>) {
      state.data = state.data.filter((p) => p.id !== action.payload);
    },
    toggleLike(state, action: PayloadAction<string>) {
      const post = state.data.find((p) => p.id === action.payload);
      if (post) {
        post.is_liked = !post.is_liked;
        post.likes_count = (post.likes_count ?? 0) + (post.is_liked ? 1 : -1);
      }
    },
    upsertPost(state, action: PayloadAction<Post>) {
      const idx = state.data.findIndex((p) => p.id === action.payload.id);
      if (idx >= 0) {
        // keep optimistic like/repost state, update everything else
        state.data[idx] = {
          ...action.payload,
          likes_count: state.data[idx].likes_count,
          is_liked: state.data[idx].is_liked,
          reposts_count: state.data[idx].reposts_count,
          is_reposted: state.data[idx].is_reposted,
        };
      } else {
        state.data.push(action.payload);
      }
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    resetPosts(state) {
      state.data = [];
      state.loading = false;
    },
  },
});

export const { setPosts, addPosts, prependPost, removePost, toggleLike, upsertPost, setLoading, resetPosts } = postsSlice.actions;
export default postsSlice.reducer;
