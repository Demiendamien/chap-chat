import React from "react";
import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  // internal: store listener ref to avoid duplicates
  messageListener: null,
  isSubscribed: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || "An error occurred");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || "An error occurred");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages = [] } = get();
    if (!selectedUser) return;
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || "An error occurred");
    }
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),

  subscribeToMessages: () => {
    const socket = useAuthStore.getState()?.socket;
    const { selectedUser, isSubscribed } = get();
    if (!socket || typeof socket.on !== "function") return;
    if (isSubscribed) return; // already subscribed

    const handler = (newMessage) => {
      const { selectedUser } = get();
      if (
        !selectedUser ||
        (newMessage.senderId !== selectedUser._id &&
         newMessage.receiverId !== selectedUser._id)
      ) {
        return;
      }

      set((state) => ({
        messages: [...state.messages, newMessage],
      }));
    };

    socket.on("newMessage", handler);
    set({ messageListener: handler, isSubscribed: true });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState()?.socket;
    const { messageListener } = get();
    if (socket && typeof socket.off === "function") {
      if (messageListener) {
        socket.off("newMessage", messageListener);
      } else {
        socket.off("newMessage");
      }
    }
    set({ messageListener: null, isSubscribed: false });
  },
}));
