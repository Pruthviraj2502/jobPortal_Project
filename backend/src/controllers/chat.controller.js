import { Chat } from "../models/chat.mpdel.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";

// Fetch all potential chat users
const getChatUsers = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    console.log(user);
    

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Fetch all recruiters if the logged-in user is a job seeker, otherwise fetch job seekers
    const userType = user.role; // Assuming you have "role" field ('jobseeker' or 'recruiter')

    const chatUsers =
      userType === "jobseeker"
        ? await User.find({ role: "recruiter" }).select("fullname username email")
        : await User.find({ role: "jobseeker" }).select("fullname username email");

    res.json(chatUsers);
  } catch (error) {
    res.status(500).json({ error: "Error fetching chat users" });
  }
};

// Fetch chat history between two users
const getChatHistory = async (req, res) => {
  try {
    const { otherUserId } = req.params;
    const userId = req.user._id;

    const messages = await Chat.find({
      $or: [
        { senderId: userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId }
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Error fetching chat history" });
  }
};

// Send a new message
const sendMessage = async (req, res) => {
  try {
    const { receiverId, message, userId } = req.body;
    const senderId = userId

    const newMessage = new Chat({ senderId, receiverId, message });
    await newMessage.save();

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: "Error sending message" });
  }
};

const getAvailableUsers = async (req, res) => {
  try {
    const userId = req.body
    console.log(userId.userId);
    const loggedInUserId = userId.userId
    

    // Find all users except the logged-in user
    const users = await User.find({ _id: { $ne: loggedInUserId } })
    .select("fullname username email");

    res.json(users);
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    res.status(500).json({ error: "Error fetching users" });
  }
};

export{
  getChatUsers,
  getChatHistory,
  sendMessage,
  getAvailableUsers
}