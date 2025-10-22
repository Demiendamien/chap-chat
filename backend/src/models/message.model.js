import mongoose from "mongoose";

// const messageSchema = new mongoose.Schema(
//     {
//         senderId : {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "User",
//             required: true,
//         },
//         receiverId : {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "User",
//             required: true,
//         },
//         text: {
//             type: String,
//             required: true,
//         },
//         image : {
//             type: String,
//         },
//     },
//     {
//         timestamps: true,
//     }
// );

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: function () {
        return !this.image; // texte requis seulement s'il n'y a pas d'image
      },
    },
    image: { type: String, default: null },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
