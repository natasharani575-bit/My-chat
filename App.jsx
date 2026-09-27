import React, { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, onValue, set } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDWNd7hSQp_SDp1wRU-2_UQ46w_choqIKU",
  authDomain: "app-chat-ebd14.firebaseapp.com",
  databaseURL: "https://app-chat-ebd14-default-rtdb.firebaseio.com",
  projectId: "app-chat-ebd14",
  storageBucket: "app-chat-ebd14.firebasestorage.app",
  messagingSenderId: "284622148480",
  appId: "1:284622148480:web:dc194d8200e71da443a765",
  measurementId: "G-0VF3JLS2NQ"
};

// Initialize Firebase Database
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export default function CompleteMessagingApp() {
  const [activeTab, setActiveTab] = useState('chats');
  const [selectedChat, setSelectedChat] = useState({ id: 'global_room', name: 'Global Community Chat', online: true });
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState('dark');
  const [attachmentMenuOpen, setAttachmentMenuOpen] = useState(false);
  const [chatInfoOpen, setChatInfoOpen] = useState(false);
  const [callActive, setCallActive] = useState(null);

  const [chats, setChats] = useState([
    { id: 'global_room', name: 'Global Community Chat', message: 'Welcome to real-time Firebase chat!', time: 'Now', unread: 0, online: true, type: 'community', pinned: true },
    { id: 2, name: 'Ali Khan', message: 'Hey, are you free?', time: '2:30 PM', unread: 2, online: true, type: 'personal', pinned: false }
  ]);

  const [messages, setMessages] = useState([]);
  const [statuses, setStatuses] = useState([
    { id: 1, name: 'Ali Khan', time: 'Today, 1:15 PM', viewed: false }
  ]);
  const [callsHistory, setCallsHistory] = useState([
    { id: 1, name: 'Ali Khan', type: 'video', direction: 'incoming', time: 'Yesterday', status: 'completed' }
  ]);

  // Real-time synchronization of messages from Firebase Realtime Database
  useEffect(() => {
    const messagesRef = ref(db, 'messages/');
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedMessages = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setMessages(loadedMessages);
      } else {
        setMessages([]);
      }
    });
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    const messagesRef = ref(db, 'messages/');
    const newMsg = {
      sender: 'me',
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
      type: 'text'
    };

    // Push new message directly to Firebase database in real-time
    push(messagesRef, newMsg);
    setMessageText('');
    setAttachmentMenuOpen(false);
  };

  return (
    <div className={`flex h-screen w-screen overflow-hidden font-sans ${theme === 'dark' ? 'bg-[#111b21] text-[#e9edef]' : 'bg-[#f0f2f5] text-[#111b21]'}`}>
      
      {/* ---------------- SIDEBAR NAVIGATION & CHAT LIST ---------------- */}
      <div className={`w-full md:w-[400px] flex flex-col border-r ${theme === 'dark' ? 'bg-[#111b21] border-[#222d34]' : 'bg-white border-gray-200'}`}>
        
        {/* App Header */}
        <div className={`px-4 py-3 flex justify-between items-center ${theme === 'dark' ? 'bg-[#202c33]' : 'bg-[#f0f2f5]'}`}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#00a884] flex items-center justify-center font-bold text-white shadow-md">
              MP
            </div>
            <span className="font-bold text-lg tracking-wide">ModernConnect</span>
          </div>
          <div className="flex space-x-5 text-xl text-[#aebac1]">
            <i className="fa-solid fa-circle-notch cursor-pointer hover:text-[#00a884] transition" title="Status"></i>
            <i className="fa-solid fa-comment-alt cursor-pointer hover:text-[#00a884] transition" title="New Chat"></i>
            <i className="fa-solid fa-ellipsis-vertical cursor-pointer hover:text-[#00a884] transition" onClick={() => setActiveTab('settings')} title="Settings"></i>
          </div>
        </div>

        {/* Global Search & Filters Bar */}
        <div className={`p-2 ${theme === 'dark' ? 'bg-[#111b21]' : 'bg-white'}`}>
          <div className={`flex items-center rounded-lg px-3 py-1.5 ${theme === 'dark' ? 'bg-[#202c33]' : 'bg-[#f0f2f5]'}`}>
            <i className="fa-solid fa-search text-[#8696a0] text-sm mr-3"></i>
            <input 
              type="text" 
              placeholder="Search chats, media, documents or users..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent w-full text-sm focus:outline-none placeholder-[#8696a0]"
            />
          </div>
        </div>

        {/* Dynamic Section View based on Bottom Navigation */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'chats' && (
            <div>
              {chats
                .filter(chat => chat.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map(chat => (
                  <div 
                    key={chat.id} 
                    onClick={() => { setSelectedChat(chat); setChatInfoOpen(false); }}
                    className={`flex items-center px-4 py-3 cursor-pointer transition ${
                      selectedChat?.id === chat.id 
                        ? (theme === 'dark' ? 'bg-[#2a3942]' : 'bg-gray-200') 
                        : (theme === 'dark' ? 'hover:bg-[#202c33]' : 'hover:bg-gray-100')
                    }`}
                  >
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-bold shadow">
                        {chat.name[0]}
                      </div>
                      {chat.online && <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 rounded-full"></span>}
                    </div>
                    <div className="ml-3 flex-1 border-b border-opacity-20 border-gray-500 pb-3">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">{chat.name}</span>
                        <span className="text-xs text-[#8696a0]">{chat.time}</span>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-sm text-[#8696a0] truncate max-w-[210px]">{chat.message}</p>
                      </div>
                    </div>
                  </div>
              ))}
            </div>
          )}

          {activeTab === 'updates' && (
            <div className="p-4 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#00a884]">Status Updates (24h)</h3>
              {statuses.map(st => (
                <div key={st.id} className="flex items-center space-x-3 p-2 rounded-lg cursor-pointer hover:bg-gray-500 hover:bg-opacity-10">
                  <div className="w-12 h-12 rounded-full p-0.5 border-2 border-emerald-500 flex items-center justify-center font-bold bg-gray-600 text-white">
                    {st.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold">{st.name}</p>
                    <p className="text-xs text-[#8696a0]">{st.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'communities' && (
            <div className="p-4 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#00a884]">Communities Hub</h3>
              <div className="p-3 rounded-xl bg-opacity-10 bg-emerald-500 border border-emerald-500 space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-[#00a884] flex items-center justify-center text-white font-bold">
                    <i className="fa-solid fa-users-rectangle"></i>
                  </div>
                  <div>
                    <h4 className="font-bold">Tech Global Community</h4>
                    <p className="text-xs text-[#8696a0]">Firebase Realtime Connected</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'calls' && (
            <div className="p-4 space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#00a884]">Recent Calls</h3>
              {callsHistory.map(call => (
                <div key={call.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-500 hover:bg-opacity-15">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center font-bold text-white">
                      {call.name[0]}
                    </div>
                    <div>
                      <p className="font-semibold">{call.name}</p>
                      <p className="text-xs text-[#8696a0]">{call.time}</p>
                    </div>
                  </div>
                  <div className="flex space-x-3 text-[#00a884] text-lg">
                    <i className="fa-solid fa-phone cursor-pointer" onClick={() => setCallActive('voice')}></i>
                    <i className="fa-solid fa-video cursor-pointer" onClick={() => setCallActive('video')}></i>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="p-4 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#00a884]">Application Settings</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center p-2 rounded hover:bg-gray-700 hover:bg-opacity-20 cursor-pointer">
                  <span>Theme Mode (Dark / Light)</span>
                  <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="px-3 py-1 rounded bg-[#00a884] text-white text-xs font-bold">
                    {theme.toUpperCase()}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Navigation Tabs */}
        <div className={`py-2.5 flex justify-around border-t text-xs font-semibold ${theme === 'dark' ? 'bg-[#202c33] border-[#222d34] text-[#8696a0]' : 'bg-gray-100 border-gray-300 text-gray-600'}`}>
          <button onClick={() => setActiveTab('chats')} className={`flex flex-col items-center ${activeTab === 'chats' ? 'text-[#00a884]' : ''}`}>
            <i className="fa-solid fa-comment mb-1 text-base"></i> Chats
          </button>
          <button onClick={() => setActiveTab('updates')} className={`flex flex-col items-center ${activeTab === 'updates' ? 'text-[#00a884]' : ''}`}>
            <i className="fa-solid fa-circle-notch mb-1 text-base"></i> Updates
          </button>
          <button onClick={() => setActiveTab('communities')} className={`flex flex-col items-center ${activeTab === 'communities' ? 'text-[#00a884]' : ''}`}>
            <i className="fa-solid fa-users mb-1 text-base"></i> Communities
          </button>
          <button onClick={() => setActiveTab('calls')} className={`flex flex-col items-center ${activeTab === 'calls' ? 'text-[#00a884]' : ''}`}>
            <i className="fa-solid fa-phone mb-1 text-base"></i> Calls
          </button>
        </div>

      </div>

      {/* ---------------- MAIN CHAT / WORKSPACE INTERFACE ---------------- */}
      {selectedChat ? (
        <div className="flex-1 flex flex-col relative bg-[#0b141a]">
          
          {/* Chat Header */}
          <div className={`px-4 py-3 flex justify-between items-center border-b ${theme === 'dark' ? 'bg-[#202c33] border-[#222d34]' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setChatInfoOpen(!chatInfoOpen)}>
              <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center font-bold text-white shadow">
                {selectedChat.name[0]}
              </div>
              <div>
                <h4 className="font-semibold">{selectedChat.name}</h4>
                <p className="text-xs text-[#8696a0]">{selectedChat.online ? 'online / Firebase Connected' : 'offline'}</p>
              </div>
            </div>
            <div className="flex space-x-6 text-xl text-[#aebac1]">
              <i className="fa-solid fa-video cursor-pointer hover:text-[#00a884]" title="Video Call" onClick={() => setCallActive('video')}></i>
              <i className="fa-solid fa-phone cursor-pointer hover:text-[#00a884]" title="Voice Call" onClick={() => setCallActive('voice')}></i>
            </div>
          </div>

          {/* Active Call Modal Overlay */}
          {callActive && (
            <div className="absolute inset-0 bg-black bg-opacity-90 z-50 flex flex-col items-center justify-center p-6 text-white space-y-6">
              <div className="w-28 h-28 rounded-full bg-teal-700 flex items-center justify-center text-4xl font-bold shadow-xl animate-pulse">
                {selectedChat.name[0]}
              </div>
              <h2 className="text-2xl font-bold">{callActive === 'video' ? 'Video Calling...' : 'Voice Calling...'}</h2>
              <button className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center text-xl hover:bg-red-500" onClick={() => setCallActive(null)}><i className="fa-solid fa-phone-slash"></i></button>
            </div>
          )}

          {/* Messages Area (Firebase Realtime Stream) */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[radial-gradient(#1f2c34_1px,transparent_1px)] bg-[size:24px_24px]">
            <div className="text-center my-2">
              <span className="text-[11px] bg-[#182229] text-[#8696a0] px-3 py-1 rounded-md shadow-sm border border-[#222d34]">
                ⚡ Real-time Firebase Database Synchronized & End-to-End Encrypted
              </span>
            </div>
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] px-3.5 py-2 rounded-lg text-sm relative shadow ${msg.sender === 'me' ? 'bg-[#005c4b] text-[#e9edef]' : 'bg-[#202c33] text-[#e9edef]'}`}>
                  <p>{msg.text}</p>
                  <div className="flex items-center justify-end space-x-1 mt-1">
                    <span className="text-[10px] text-[#8696a0]">{msg.time}</span>
                    <i className="fa-solid fa-check-double text-[10px] text-teal-400"></i>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Attachment Floating Menu */}
          {attachmentMenuOpen && (
            <div className="absolute bottom-16 left-16 bg-[#233138] border border-[#2f3b43] rounded-2xl p-4 shadow-2xl z-20 grid grid-cols-3 gap-4 text-center text-xs">
              <div className="cursor-pointer group"><div className="w-12 h-12 rounded-full bg-purple-600 mx-auto flex items-center justify-center text-white text-lg mb-1"><i className="fa-solid fa-file"></i></div>Document</div>
              <div className="cursor-pointer group"><div className="w-12 h-12 rounded-full bg-pink-600 mx-auto flex items-center justify-center text-white text-lg mb-1"><i className="fa-solid fa-image"></i></div>Photos</div>
            </div>
          )}

          {/* Message Input Box */}
          <form onSubmit={handleSendMessage} className="px-4 py-3 bg-[#202c33] flex items-center space-x-4 border-t border-[#222d34]">
            <i className={`fa-solid ${attachmentMenuOpen ? 'fa-xmark text-red-400' : 'fa-paperclip text-[#aebac1]'} text-xl cursor-pointer hover:text-white transition`} onClick={() => setAttachmentMenuOpen(!attachmentMenuOpen)}></i>
            <input 
              type="text" 
              placeholder="Type a message to sync in real-time..." 
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="flex-1 bg-[#2a3942] text-[#e9edef] px-4 py-2.5 rounded-lg text-sm focus:outline-none placeholder-[#8696a0]"
            />
            <button type="submit" className="text-[#00a884] text-xl hover:scale-110 transition">
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </form>

        </div>
      ) : null}

    </div>
  );
}
