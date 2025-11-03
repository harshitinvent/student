import React from 'react';
import { FirebaseAuthProvider } from '../../providers/firebaseAuth';
import StudentChat from '../../components/features/chat/StudentChat';

const StudentChatPage: React.FC = () => {
    return (
        <FirebaseAuthProvider>
            <StudentChat />
        </FirebaseAuthProvider>
    );
};

export default StudentChatPage;
