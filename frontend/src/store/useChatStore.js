// import React from "react";
// import { create } from "zustand";
// import toast from "react-hot-toast";
// import { axiosInstance } from "../lib/axios.js";
// import { useAuthStore } from "./useAuthStore";

// export const useChatStore = create((set, get) => ({
//   messages: [],
//   users: [],
//   selectedUser: null,
//   isUsersLoading: false,
//   isMessagesLoading: false,

//   // internal: store listener ref to avoid duplicates
//   messageListener: null,
//   isSubscribed: false,

//   getUsers: async () => {
//     set({ isUsersLoading: true });
//     try {
//       const res = await axiosInstance.get("/messages/users");
//       set({ users: res.data });
//     } catch (error) {
//       toast.error(error?.response?.data?.message || error.message || "An error occurred");
//     } finally {
//       set({ isUsersLoading: false });
//     }
//   },

//   getMessages: async (userId) => {
//     set({ isMessagesLoading: true });
//     try {
//       const res = await axiosInstance.get(`/messages/${userId}`);
//       set({ messages: res.data });
//     } catch (error) {
//       toast.error(error?.response?.data?.message || error.message || "An error occurred");
//     } finally {
//       set({ isMessagesLoading: false });
//     }
//   },

//   sendMessage: async (messageData) => {
//     const { selectedUser, messages = [] } = get();
//     if (!selectedUser) return;
//     try {
//       const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
//       set({ messages: [...messages, res.data] });
//     } catch (error) {
//       toast.error(error?.response?.data?.message || error.message || "An error occurred");
//     }
//   },

//   setSelectedUser: (selectedUser) => set({ selectedUser }),

//   subscribeToMessages: () => {
//     const socket = useAuthStore.getState()?.socket;
//     const { selectedUser, isSubscribed } = get();
//     if (!socket || typeof socket.on !== "function") return;
//     if (isSubscribed) return; // already subscribed

//     const handler = (newMessage) => {
//       const { selectedUser } = get();
//       if (
//         !selectedUser ||
//         (newMessage.senderId !== selectedUser._id &&
//          newMessage.receiverId !== selectedUser._id)
//       ) {
//         return;
//       }

//       set((state) => ({
//         messages: [...state.messages, newMessage],
//       }));
//     };

//     socket.on("newMessage", handler);
//     set({ messageListener: handler, isSubscribed: true });
//   },

//   unsubscribeFromMessages: () => {
//     const socket = useAuthStore.getState()?.socket;
//     const { messageListener } = get();
//     if (socket && typeof socket.off === "function") {
//       if (messageListener) {
//         socket.off("newMessage", messageListener);
//       } else {
//         socket.off("newMessage");
//       }
//     }
//     set({ messageListener: null, isSubscribed: false });
//   },
// }));



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

  // Internal: listener ref pour éviter les doublons
  messageListener: null,
  isSubscribed: false,

  // 🔹 Récupérer la liste des utilisateurs
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || "Erreur lors du chargement des utilisateurs");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  // 🔹 Récupérer les messages avec un utilisateur
  getMessages: async (userId) => {
    if (!userId) return;
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || "Erreur lors du chargement des messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  // 🔹 Envoyer un message
  sendMessage: async ({ text, image }) => {
    const { selectedUser, messages = [] } = get();
    if (!selectedUser) {
      toast.error("Aucun utilisateur sélectionné");
      return;
    }

    if (!text && !image) {
      toast.error("Le message doit contenir du texte ou une image");
      return;
    }

    try {
      const payload = { text: text || "", image: image || null };
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, payload);

      // Mise à jour locale immédiate
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error?.response?.data?.error || error?.response?.data?.message || error.message || "Erreur lors de l'envoi du message");
    }
  },

  // 🔹 Sélectionner un utilisateur
  setSelectedUser: (user) => set({ selectedUser: user }),

  // 🔹 Souscription aux messages via socket
  subscribeToMessages: () => {
    const socket = useAuthStore.getState()?.socket;
    const { selectedUser, isSubscribed } = get();

    if (!socket || typeof socket.on !== "function") return;
    if (isSubscribed) return;

    const handler = (newMessage) => {
      const { selectedUser } = get();
      if (!selectedUser) return;

      // Vérifie si le message concerne l'utilisateur actif
      const isRelevant =
        newMessage.senderId === selectedUser._id ||
        newMessage.receiverId === selectedUser._id;

      if (!isRelevant) return;

      set((state) => ({
        messages: [...state.messages, newMessage],
      }));
    };

    socket.on("newMessage", handler);
    set({ messageListener: handler, isSubscribed: true });
  },

  // 🔹 Désabonnement des messages
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState()?.socket;
    const { messageListener } = get();

    if (socket && typeof socket.off === "function") {
      if (messageListener) socket.off("newMessage", messageListener);
      else socket.off("newMessage");
    }

    set({ messageListener: null, isSubscribed: false });
  },
}));
