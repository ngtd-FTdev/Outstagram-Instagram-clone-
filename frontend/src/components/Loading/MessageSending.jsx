const MessageSending = () => {
  return (
    <div className="flex justify-end items-center gap-2 px-4 py-2">
      <div className="text-sm text-gray-500">Đang gửi</div>
      <div className="flex space-x-1">
        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" 
             style={{ animationDelay: '0ms' }}></div>
        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" 
             style={{ animationDelay: '150ms' }}></div>
        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" 
             style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  );
};

export default MessageSending; 