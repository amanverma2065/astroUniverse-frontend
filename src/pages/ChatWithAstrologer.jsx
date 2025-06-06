import React, { useState, useEffect, useRef } from 'react'
import { useAppContext } from '../context/AppContext'
import io from 'socket.io-client';
import toast from 'react-hot-toast';

const socket = io(process.env.REACT_APP_BACKEND_URL, {
  transports: ['websocket'],
});

function ChatWithAstrologer() {

  const { currentSubscription, selectedChatAstrologer, setSelectedChatAstrologer, user, axios } = useAppContext();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedFileName, setSelectedFileName] = useState();
  const [image, setImage] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  const imageInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  // Fetch chat messages when astrologer is selected
  useEffect(() => {
    if (!selectedChatAstrologer) return;

    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(`/api/message/get-message?userId=${user._id}&userModel=User&astrologerId=${selectedChatAstrologer._id}&astrologerModel=Astrologer`);
        console.log("MESSAGGGGGGGG", data.data);
        setMessages(data.data);
      } catch (err) {
        console.error('Error fetching messages:', err);
      }
    };

    fetchMessages();
  }, [selectedChatAstrologer]);

  // Socket listener
  useEffect(() => {
    socket.on('receiveMessage', (msg) => {
      if (
        (msg.senderId === user._id && msg.receiverId === selectedChatAstrologer._id) ||
        (msg.senderId === selectedChatAstrologer._id && msg.receiverId === user._id)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => socket.off('receiveMessage');
  }, [selectedChatAstrologer, user._id]);

  // Send message
  // const handleSendMessage = async () => {
  //   if (!newMessage.trim()) return;

  //   const messageData = {
  //     message: newMessage,
  //     senderId: user._id,
  //     senderModel: 'User',
  //     receiverId: selectedChatAstrologer._id,
  //     receiverModel: 'Astrologer',
  //   };

  //   try {
  //     const { data } = await axios.post('/api/message/send-message', messageData);
  //     socket.emit('sendMessage', data.data); // emit to server
  //     // setMessages((prev) => [...prev, data.data]);
  //     setNewMessage('');
  //   } catch (err) {
  //     console.error('Error sending message:', err);
  //   }
  // };

  const handleSendMessage = async () => {
    if (!newMessage.trim() && !image) return;

    const toastId = toast.loading('Sending...');
    setIsSending(true);

    const formData = new FormData();
    formData.append('senderId', user._id);
    formData.append('senderModel', 'User');
    formData.append('receiverId', selectedChatAstrologer._id);
    formData.append('receiverModel', 'Astrologer');
    if (newMessage.trim()) formData.append('message', newMessage);
    if (image) formData.append('image', image);

    try {
      const { data } = await axios.post('/api/message/send-message', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      socket.emit('sendMessage', data.data);
      setNewMessage('');
      setImage(null);
      setSelectedFileName(null);
      if (imageInputRef.current) imageInputRef.current.value = '';
      toast.success('Message sent!', { id: toastId });
    } catch (err) {
      console.error('Error sending message:', err);
      toast.error('Failed to send message', { id: toastId });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-2 sm:p-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left - Subscribed Astrologers */}
          <div className="bg-gray-800 rounded-xl p-3 sm:p-4 h-[calc(100vh-1rem)] sm:h-[calc(100vh-2rem)] overflow-y-auto">
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">My Astrologers</h2>
            {currentSubscription?.length > 0 ? (
              <div className="space-y-2 sm:space-y-3">
                {currentSubscription.map((subscription) => (
                  <div
                    key={subscription._id}
                    className="bg-gray-700/50 rounded-lg p-2 sm:p-3 cursor-pointer hover:bg-gray-700 transition-all duration-300"
                    onClick={() => setSelectedChatAstrologer(subscription.astrologerId)}
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <img
                        src={subscription?.astrologerId?.profileImage}
                        alt={subscription?.astrologerId?.firstName}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="text-white font-medium text-sm sm:text-base">
                          {subscription?.astrologerId?.firstName} {subscription?.astrologerId?.lastName}
                        </h3>
                        <p className="text-gray-400 text-xs sm:text-sm">{subscription?.planName}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 sm:py-8">
                <p className="text-gray-400 text-sm sm:text-base">No subscribed astrologers found.</p>
              </div>
            )}
          </div>

          {/* Right - Chat */}
          {selectedChatAstrologer ? (
            <div className="lg:col-span-2">
              <div className="bg-gray-800 rounded-xl p-3 sm:p-4 h-[calc(100vh-1rem)] sm:h-[calc(100vh-2rem)] flex flex-col">
                {/* Astrologer Info */}
                <div className="flex items-center gap-3 pb-3 border-b border-gray-700">
                  <img
                    src={selectedChatAstrologer?.profileImage}
                    alt={selectedChatAstrologer?.firstName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-white font-medium">
                      {selectedChatAstrologer?.firstName} {selectedChatAstrologer?.lastName}
                    </h3>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto hide-scrollbar">
                  <div className="space-y-4 p-4">
                    {messages.map((msg, index) => (
                      <div
                        key={index}
                        className={`flex ${msg.senderId === user._id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`rounded-lg p-3 max-w-[80%] ${msg.senderId === user._id ? 'bg-purple-600' : 'bg-gray-700'}`}>
                          {msg.message && <p className="text-white text-sm">{msg.message}</p>}

                          {msg.image && (
                            <img
                              src={msg.image}
                              alt="Sent"
                              className="mt-2 w-full max-w-[240px] max-h-[300px] rounded-lg object-cover"
                            />
                          )}

                          <span className="text-gray-400 text-xs mt-1 block">
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {/* Chat Input */}
                <div className="mt-auto pt-2">
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <label className="relative cursor-pointer bg-gray-700 hover:bg-gray-600 rounded-lg px-3 py-2 transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            setImage(e.target.files[0]);
                            setSelectedFileName(e.target.files[0]?.name);
                          }}
                          className="hidden"
                          ref={imageInputRef}
                          disabled={isSending}
                          title="Attach file"
                        />
                        <svg
                          className="w-5 h-5 text-purple-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </label>

                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 bg-gray-700 text-white rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500"
                        disabled={isSending}
                      />

                      <button
                        onClick={handleSendMessage}
                        disabled={isSending}
                        className="bg-purple-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm sm:text-base"
                      >
                        {isSending ? 'Sending...' : 'Send'}
                      </button>
                    </div>

                    {selectedFileName && (
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                        <span>{selectedFileName}</span>
                        <button
                          disabled={isSending}
                          onClick={() => {
                            setImage(null);
                            setSelectedFileName(null);
                            if (imageInputRef.current) {
                              imageInputRef.current.value = '';
                            }
                          }}
                          className="text-purple-400 hover:text-purple-300"
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="lg:col-span-2">
              <div className="bg-gray-800 rounded-xl p-3 sm:p-4 h-[calc(100vh-1rem)] sm:h-[calc(100vh-2rem)] flex flex-col">
                <div className="flex-1 overflow-y-auto flex justify-center items-center">
                  <div className="text-center py-6 sm:py-8">
                    <p className="text-gray-400 text-sm sm:text-base">Select an astrologer to start chatting</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatWithAstrologer