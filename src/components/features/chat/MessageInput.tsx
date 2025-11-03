import React, { useState, useRef } from 'react';
import { Button, Input } from 'antd';
import { SendOutlined, PaperClipOutlined, SmileOutlined } from '@ant-design/icons';

const { TextArea } = Input;

interface MessageInputProps {
    onSendMessage: (message?: string) => void;
    placeholder?: string;
    disabled?: boolean;
    loading?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
    onSendMessage,
    placeholder = "Type a message...",
    disabled = false,
    loading = false
}) => {
    const [message, setMessage] = useState('');
    const textAreaRef = useRef<any>(null);

    const handleSend = () => {
        const messageContent = message.trim();
        if (!messageContent || disabled || loading) return;

        onSendMessage(messageContent);
        setMessage('');

        // Focus back to textarea after sending
        if (textAreaRef.current) {
            textAreaRef.current.focus();
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleAttachment = () => {
        // Implementation for file attachment
        console.log('Attachment clicked');
    };

    const handleEmoji = () => {
        // Implementation for emoji picker
        console.log('Emoji clicked');
    };

    return (
        <div style={{
            padding: '16px',
            borderTop: '1px solid #e2e8f0',
            backgroundColor: '#f0f2f5'
        }}>
            <div style={{
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-end',
                backgroundColor: '#ffffff',
                padding: '8px',
                borderRadius: '24px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
                {/* Attachment Button */}
                <Button
                    type="text"
                    icon={<PaperClipOutlined />}
                    onClick={handleAttachment}
                    disabled={disabled}
                    style={{
                        color: '#64748b',
                        border: 'none',
                        backgroundColor: 'transparent',
                        minWidth: '40px',
                        height: '40px'
                    }}
                    title="Attach file"
                />

                {/* Message Input */}
                <TextArea
                    ref={textAreaRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={placeholder}
                    disabled={disabled}
                    autoSize={{ minRows: 1, maxRows: 4 }}
                    style={{
                        flex: 1,
                        border: 'none',
                        borderRadius: '20px',
                        backgroundColor: 'transparent',
                        fontSize: '14px',
                        lineHeight: '1.5',
                        color: '#1e293b',
                        padding: '8px 12px',
                        resize: 'none',
                        boxShadow: 'none'
                    }}
                    styles={{
                        textarea: {
                            backgroundColor: 'transparent',
                            border: 'none',
                            boxShadow: 'none',
                            padding: '8px 12px'
                        }
                    }}
                />

                {/* Emoji Button */}
                <Button
                    type="text"
                    icon={<SmileOutlined />}
                    onClick={handleEmoji}
                    disabled={disabled}
                    style={{
                        color: '#64748b',
                        border: 'none',
                        backgroundColor: 'transparent',
                        minWidth: '40px',
                        height: '40px'
                    }}
                    title="Add emoji"
                />

                {/* Send Button */}
                <Button
                    type="primary"
                    icon={<SendOutlined />}
                    onClick={handleSend}
                    disabled={!message.trim() || disabled}
                    loading={loading}
                    style={{
                        backgroundColor: '#25d366',
                        borderColor: '#25d366',
                        borderRadius: '50%',
                        minWidth: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 4px rgba(37, 211, 102, 0.3)'
                    }}
                    title="Send message"
                />
            </div>
        </div>
    );
};

export default MessageInput;
