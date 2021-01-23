import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { backendUrl } from '../config/config';

axios.defaults.baseURL = backendUrl;
axios.defaults.withCredentials = true; // front, backend 간 쿠키공유

export function loadPostsAPI(data) {
  return axios.get(`/posts?last=${data?.lastId || 0}`);
}
export const loadPosts = createAsyncThunk('post/loadPosts', async (data) => {
  const response = await loadPostsAPI(data);
  return response.data;
});

export const addPost = createAsyncThunk('post/addPost', async (data, { rejectWithValue }) => {
  console.log('addPost call', data);
  try {
    const response = await axios.post('/post', data);
    console.log('addPost api call', response.data);

    // dispatch(userSlice.actions.addPostToMe(response.data.id));

    return response.data;
  } catch (error) {
    console.log('addPost api error', error);
    return rejectWithValue(error.response.data);
  }
});

export const uploadImages = createAsyncThunk('post/uploadImages', async (data, { rejectWithValue }) => {
  console.log('uploadImages call', data);
  try {
    const response = await axios.post('/post/images', data); // POST /post/images
    console.log('uploadImages api call', response.data);
    return response.data;
  } catch (error) {
    console.log('uploadImages api error', error);
    return rejectWithValue(error.response.data);
  }
});

export const addComment = createAsyncThunk('post/addComment', async (data, { rejectWithValue }) => {
  console.log('addComment call', data);
  try {
    const response = await axios.post(`/post/${data.postId}/comment`, data); // POST /post/1/comment
    console.log('addComment api call', response.data);
    return response.data;
  } catch (error) {
    console.log('addComment api error', error);
    return rejectWithValue(error.response.data);
  }
});

export const removePost = createAsyncThunk('post/removePost', async (data, { rejectWithValue }) => {
  console.log('removePost call', data);
  try {
    const response = await axios.delete(`/post/${data.postId}`); // DELETE /post/1/comment
    console.log('removePost api call', response.data);
    return response.data;
  } catch (error) {
    console.log('removePost api error', error);
    return rejectWithValue(error.response.data);
  }
});

export function loadPostAPI(data) {
  return axios.get(`/post/${data.postId}`);
}

export const likePost = createAsyncThunk('post/likePost', async (data, { rejectWithValue }) => {
  console.log('likePost call', data);
  try {
    const response = await axios.patch(`/post/${data.postId}/like`); // PATCH /post/1/like
    console.log('likePost api call', response.data);
    return response.data;
  } catch (error) {
    console.log('likePost api error', error);
    return rejectWithValue(error.response.data);
  }
});

export const unlikePost = createAsyncThunk('post/unlikePost', async (data, { rejectWithValue }) => {
  console.log('unlikePost call', data);
  try {
    const response = await axios.delete(`/post/${data.postId}/like`); // DELETE /post/1/like
    console.log('unlikePost api call', response.data);
    return response.data;
  } catch (error) {
    console.log('unlikePost api error', error);
    return rejectWithValue(error.response.data);
  }
});

export const retweet = createAsyncThunk('post/retweet', async (data, { rejectWithValue }) => {
  console.log('retweet call', data);
  try {
    const response = await axios.post(`/post/${data.postId}/retweet`, data);
    console.log('retweet api call', response.data);
    return response.data;
  } catch (error) {
    console.log('retweet api error', error);
    return rejectWithValue(error.response.data);
  }
});

export const updatePost = createAsyncThunk('post/updatePost', async (data, { rejectWithValue }) => {
  console.log('updatePost call', data);
  try {
    const response = await axios.patch(`/post/${data.postId}`, data);
    console.log('updatePost api call', response.data);
    return response.data;
  } catch (error) {
    console.log('updatePost api error', error);
    return rejectWithValue(error.response.data);
  }
});

export function loadHashtagPostsAPI(data) {
  return axios.get(`/hashtag/${encodeURIComponent(data.hashtag)}?last=${data?.lastId || 0}`);
}

export const loadHashtagPosts = createAsyncThunk('post/loadHashtagPosts', async (data, { rejectWithValue }) => {
  console.log('loadHashtagPosts call', data);
  try {
    const response = await loadHashtagPostsAPI(data);
    console.log('loadHashtagPosts api call', response.data);
    return response.data;
  } catch (error) {
    console.log('loadHashtagPosts api error', error);
    return rejectWithValue(error.response.data);
  }
});

export function loadUserPostsAPI(data) {
  return axios.get(`/user/${data.userId}/posts?last=${data?.lastId || 0}`);
}

export const loadUserPosts = createAsyncThunk('user/loadUserPosts', async (data, { rejectWithValue }) => {
  console.log('loadUserPosts call', data);
  try {
    const response = await loadUserPostsAPI(data);
    console.log('loadUserPosts api call', response.data);
    return response.data;
  } catch (error) {
    console.log('loadUserPosts api error', error);
    return rejectWithValue(error.response.data);
  }
});
