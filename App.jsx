import React, { useState, useEffect } from 'react';

export default function CompleteMessagingApp() {
  // Navigation Tabs: 'chats', 'updates', 'communities', 'calls', 'settings', 'channels', 'business'
  const [activeTab, setActiveTab] = useState('chats');
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState('dark'); // 'dark' or 'light'
  const [attachmentMenuOpen, setAttachmentMenuOpen] = useState(false);
  const [chatInfoOpen, setChatInfoOpen] = useState(false);
  const [callActive, setCallActive] = useState(null); // 'voice', 'video', null

  // Complete Mock State for Global Messaging Platform
  const [chats, setChats] = useState([
    { id: 1, name: 'Ali Khan', message: 'Hey, are you free for the project sync?', time: '2:30 PM', unread: 2, online: true, type: 'personal', pinned: true },
    { id: 2, name: 'Sara Ahmed', message: 'Photo sent (HD)', time: '9:45 AM', unread: 0, online: false, type: 'personal', pinned: false },
    { id: 3, name: 'Tech Community Hub', message: 'Admin: Weekly developer meetup at 8 PM', time: 'Yesterday', unread: 5, online: true, type: 'community', pinned: true },
    { id: 4, name: 'Global Tech News Channel', message: 'New update released for React & Tailwind architecture.', time: 'Monday', unread: 12, online: true, type: 'channel', pinned: false }
  ]);

  const [messages, setMessages] = useState([
    { id: 1, sender: 'them', text: 'Hello! Welcome to the modern messaging platform.', time: '10:30 AM', status: 'read', type: 'text' },
    { id: 2, sender: 'me', text: 'Hi! All features like E2EE, Calls, Status, and Channels are integrated.', time: '10:32 AM', status: 'read', type: 'text' },
    { id: 3, sender: 'them', text: 'Awesome. Let us check the real-time Firebase sync.', time: '10:35 AM', status: 'delivered', type: 'text' }
  ]);

  const [statuses, setStatuses] = useState([
    { id: 1, name: 'Ali Khan', time: 'Today, 1:15 PM', viewed: false },
    { id: 2, name: 'Sara Ahmed', time: 'Today, 11:00 AM', viewed: true }
  ]);

  const [callsHistory, setCallsHistory] = useState([
    { id: 1, name: 'Ali Khan', type: 'video', direction: 'incoming', time: 'Yesterday, 8:40 PM', status: 'completed' },
    { id: 2, name: 'Sara Ahmed', type: 'voice', direction: 'missed', time: '2 days ago', status: 'missed' }
  ]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    const newMsg = {
      id: messages.length + 1,
      sender: 'me',
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
      type: 'text'
    };

    setMessages([...messages, newMsg]);
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
                        {chat.unread > 0 && (
                          <span className="bg-[#00a884] text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                            {chat.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
              ))}
            </div>
          )}

          {activeTab === 'updates' && (
            <div className="p-4 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#00a884]">Status Updates (24h)</h3>
              <div className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-opacity-20 hover:bg-gray-500">
                <div className="w-12 h-12 rounded-full border-2 border-[#00a884] flex items-center justify-center font-bold">
                  +
                </div>
                <div>
                  <p className="font-semibold">My Status</p>
                  <p className="text-xs text-[#8696a0]">Tap to add status update</p>
                </div>
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#00a884] mt-6">Recent Updates</h3>
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
                    <p className="text-xs text-[#8696a0]">5 linked groups • 1,420 members</p>
                  </div>
                </div>
                <p className="text-xs text-gray-400">Announcements channel and sub-groups for developers, designers, and founders.</p>
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
                      <p className="text-xs text-[#8696a0] flex items-center space-x-1">
                        <i className={`fa-solid ${call.direction === 'incoming' ? 'fa-arrow-down text-emerald-400' : 'fa-arrow-up text-red-400'}`}></i>
                        <span>{call.time}</span>
                      </p>
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
                <div className="p-2 rounded hover:bg-gray-700 hover:bg-opacity-20 cursor-pointer">Account & Privacy (E2EE)</div>
                <div className="p-2 rounded hover:bg-gray-700 hover:bg-opacity-20 cursor-pointer">Chats Backup & Storage</div>
                <div className="p-2 rounded hover:bg-gray-700 hover:bg-opacity-20 cursor-pointer">Linked Devices (QR Connect)</div>
                <div className="p-2 rounded hover:bg-gray-700 hover:bg-opacity-20 cursor-pointer text-red-400">Log Out / Delete Account</div>
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
                <p className="text-xs text-[#8696a0]">{selectedChat.online ? 'online / E2EE Protected' : 'last seen recently'}</p>
              </div>
            </div>
            <div className="flex space-x-6 text-xl text-[#aebac1]">
              <i className="fa-solid fa-video cursor-pointer hover:text-[#00a884]" title="Video Call" onClick={() => setCallActive('video')}></i>
              <i className="fa-solid fa-phone cursor-pointer hover:text-[#00a884]" title="Voice Call" onClick={() => setCallActive('voice')}></i>
              <i className="fa-solid fa-search cursor-pointer hover:text-[#00a884]" title="Search in Chat"></i>
              <i className="fa-solid fa-ellipsis-vertical cursor-pointer hover:text-[#00a884]" onClick={() => setChatInfoOpen(!chatInfoOpen)} title="Chat Info"></i>
            </div>
          </div>

          {/* Active Call Modal Overlay */}
          {callActive && (
            <div className="absolute inset-0 bg-black bg-opacity-90 z-50 flex flex-col items-center justify-center p-6 text-white space-y-6">
              <div className="w-28 h-28 rounded-full bg-teal-700 flex items-center justify-center text-4xl font-bold shadow-xl animate-pulse">
                {selectedChat.name[0]}
              </div>
              <h2 className="text-2xl font-bold">{callActive === 'video' ? 'Video Calling...' : 'Voice Calling...'}</h2>
              <p className="text-sm text-gray-400">Secure End-to-End Encrypted Connection with {selectedChat.name}</p>
              <div className="flex space-x-6 mt-10">
                <button className="w-14 h-14 rounded-full bg-gray-700 flex items-center justify-center text-xl hover:bg-gray-600"><i className="fa-solid fa-microphone-slash"></i></button>
                <button className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center text-xl hover:bg-red-500" onClick={() => setCallActive(null)}><i className="fa-solid fa-phone-slash"></i></button>
                <button className="w-14 h-14 rounded-full bg-gray-700 flex items-center justify-center text-xl hover:bg-gray-600"><i className="fa-solid fa-volume-high"></i></button>
              </div>
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[radial-gradient(#1f2c34_1px,transparent_1px)] bg-[size:24px_24px]">
            <div className="text-center my-2">
              <span className="text-[11px] bg-[#182229] text-[#8696a0] px-3 py-1 rounded-md shadow-sm border border-[#222d34]">
                🔒 Messages and calls are end-to-end encrypted. No one outside of this chat can read or listen to them.
              </span>
            </div>
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] px-3.5 py-2 rounded-lg text-sm relative shadow ${msg.sender === 'me' ? 'bg-[#005c4b] text-[#e9edef]' : 'bg-[#202c33] text-[#e9edef]'}`}>
                  <p>{msg.text}</p>
                  <div className="flex items-center justify-end space-x-1 mt-1">
                    <span className="text-[10px] text-[#8696a0]">{msg.time}</span>
                    {msg.sender === 'me' && <i className="fa-solid fa-check-double text-[10px] text-teal-400"></i>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Attachment Floating Menu */}
          {attachmentMenuOpen && (
            <div className="absolute bottom-16 left-16 bg-[#233138] border border-[#2f3b43] rounded-2xl p-4 shadow-2xl z-20 grid grid-cols-3 gap-4 text-center text-xs">
              <div className="cursor-pointer group"><div className="w-12 h-12 rounded-full bg-purple-600 mx-auto flex items-center justify-center text-white text-lg mb-1"><i className="fa-solid fa-file"></i></div>Document</div>
              <div className="cursor-pointer group"><div className="w-12 h-12 rounded-full bg-pink-600 mx-auto flex items-center justify-center text-white text-lg mb-1"><i className="fa-solid fa-image"></i></div>Photos & Videos</div>
              <div className="cursor-pointer group"><div className="w-12 h-12 rounded-full bg-red-500 mx-auto flex items-center justify-center text-white text-lg mb-1"><i className="fa-solid fa-square-poll-vertical"></i></div>Poll</div>
              <div className="cursor-pointer group"><div className="w-12 h-12 rounded-full bg-orange-500 mx-auto flex items-center justify-center text-white text-lg mb-1"><i className="fa-solid fa-location-dot"></i></div>Location</div>
              <div className="cursor-pointer group"><div className="w-12 h-12 rounded-full bg-teal-600 mx-auto flex items-center justify-center text-white text-lg mb-1"><i className="fa-solid fa-calendar-days"></i></div>Event</div>
              <div className="cursor-pointer group"><div className="w-12 h-12 rounded-full bg-blue-600 mx-auto flex items-center justify-center text-white text-lg mb-1"><i className="fa-solid fa-user"></i></div>Contact</div>
            </div>
          )}

          {/* Message Input Box */}
          <form onSubmit={handleSendMessage} className="px-4 py-3 bg-[#202c33] flex items-center space-x-4 border-t border-[#222d34]">
            <i className="fa-regular fa-face-smile text-[#aebac1] text-xl cursor-pointer hover:text-white"></i>
            <i className={`fa-solid ${attachmentMenuOpen ? 'fa-xmark text-red-400' : 'fa-paperclip text-[#aebac1]'} text-xl cursor-pointer hover:text-white transition`} onClick={() => setAttachmentMenuOpen(!attachmentMenuOpen)}></i>
            <input 
              type="text" 
              placeholder="Type a message or use voice/media..." 
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="flex-1 bg-[#2a3942] text-[#e9edef] px-4 py-2.5 rounded-lg text-sm focus:outline-none placeholder-[#8696a0]"
            />
            {messageText ? (
              <button type="submit" className="text-[#00a884] text-xl hover:scale-110 transition">
                <i className="fa-solid fa-paper-plane"></i>
              </button>
            ) : (
              <i className="fa-solid fa-microphone text-[#aebac1] text-xl cursor-pointer hover:text-white" title="Voice Note"></i>
            )}
          </form>

        </div>
      ) : (
        <div className="flex-1 hidden md:flex flex-col items-center justify-center bg-[#222d34] text-center p-8 border-l border-[#222d34]">
          <div className="w-24 h-24 rounded-full bg-[#111b21] flex items-center justify-center text-[#00a884] text-4xl mb-4 shadow-inner">
            <i className="fa-solid fa-comments"></i>
          </div>
          <h2 className="text-3xl font-light text-[#e9edef] mb-3">Modern Messaging Web Platform</h2>
          <p className="text-sm text-[#8696a0] max-w-md leading-relaxed">
            Send and receive messages with real-time Firebase sync, end-to-end encryption, voice/video calls, and rich media sharing without leaving your browser or app.
          </p>
        </div>
      )}

      {/* Right Contact/Chat Info Panel Drawer */}
      {selectedChat && chatInfoOpen && (
        <div className={`w-[320px] border-l flex flex-col ${theme === 'dark' ? 'bg-[#111b21] border-[#222d34]' : 'bg-white border-gray-200'}`}>
          <div className={`px-4 py-3 flex items-center space-x-3 border-b ${theme === 'dark' ? 'bg-[#202c33] border-[#222d34]' : 'bg-gray-100 border-gray-200'}`}>
            <i className="fa-solid fa-xmark cursor-pointer text-lg" onClick={() => setChatInfoOpen(false)}></i>
            <span className="font-bold">Contact Info</span>
          </div>
          <div className="p-6 flex flex-col items-center text-center border-b border-opacity-20 border-gray-500">
            <div className="w-20 h-20 rounded-full bg-teal-600 flex items-center justify-center text-white text-3xl font-bold mb-3 shadow">
              {selectedChat.name[0]}
            </div>
            <h3 className="text-lg font-bold">{selectedChat.name}</h3>
            <p className="text-xs text-[#8696a0] mt-1">+92 300 1234567 • Available</p>
          </div>
          <div className="p-4 space-y-3 text-sm">
            <div className="p-2 rounded hover:bg-gray-700 hover:bg-opacity-20 cursor-pointer flex justify-between"><span>Media, links and docs</span><i className="fa-solid fa-chevron-right text-xs"></i></div>
            <div className="p-2 rounded hover:bg-gray-700 hover:bg-opacity-20 cursor-pointer flex justify-between"><span>Starred Messages</span><i className="fa-solid fa-chevron-right text-xs"></i></div>
            <div className="p-2 rounded hover:bg-gray-700 hover:bg-opacity-20 cursor-pointer flex justify-between"><span>Disappearing Messages</span><span className="text-xs text-[#00a884]">Off</span></div>
            <div className="p-2 rounded hover:bg-gray-700 hover:bg-opacity-20 cursor-pointer flex justify-between"><span>Chat Lock</span><span className="text-xs text-[#00a884]">Disabled</span></div>
            <div className="p-2 rounded hover:bg-gray-700 hover:bg-opacity-20 cursor-pointer text-red-500 font-semibold">Block {selectedChat.name}</div>
          </div>
        </div>
      )}

    </div>
  );
}
