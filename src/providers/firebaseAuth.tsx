import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    User,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { Student } from '../services/studentAPI';

interface FirebaseAuthContextType {
    user: User | null;
    student: Student | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, studentData: Partial<Student>) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
}

const FirebaseAuthContext = createContext<FirebaseAuthContextType | null>(null);

export const useFirebaseAuth = () => {
    const context = useContext(FirebaseAuthContext);
    if (!context) {
        throw new Error('useFirebaseAuth must be used within a FirebaseAuthProvider');
    }
    return context;
};

export const FirebaseAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [student, setStudent] = useState<Student | null>(null);
    const [loading, setLoading] = useState(true);

    // Load student data when user changes
    useEffect(() => {
        const loadStudentData = async (user: User) => {
            try {
                // First check localStorage for existing student data
                const savedStudent = localStorage.getItem('studentData');
                if (savedStudent) {
                    const studentData = JSON.parse(savedStudent);
                    console.log('Loading student from localStorage:', studentData);
                    setStudent(studentData);
                    return;
                }

                // If not in localStorage, try to get from Firestore
                const studentDoc = await getDoc(doc(db, 'students', user.uid));
                if (studentDoc.exists()) {
                    const studentData = studentDoc.data() as Student;
                    console.log('Loading student from Firestore:', studentData);
                    // Save to localStorage for future use
                    localStorage.setItem('studentData', JSON.stringify(studentData));
                    setStudent(studentData);
                } else {
                    // If no student document exists, create one with basic info
                    const basicStudentData: Student = {
                        ID: parseInt(user.uid) || Date.now(),
                        CreatedAt: new Date().toISOString(),
                        UpdatedAt: new Date().toISOString(),
                        student_id: user.email?.split('@')[0] || 'STU' + Date.now(),
                        first_name: user.displayName?.split(' ')[0] || 'Student',
                        last_name: user.displayName?.split(' ')[1] || 'User',
                        email: user.email || '',
                        phone_number: '',
                        program: 'General Studies',
                        year_of_study: 1,
                        is_active: true,
                        created_at: new Date().toISOString()
                    };

                    await setDoc(doc(db, 'students', user.uid), basicStudentData);
                    // Save to localStorage
                    localStorage.setItem('studentData', JSON.stringify(basicStudentData));
                    setStudent(basicStudentData);
                }
            } catch (error) {
                console.error('Error loading student data:', error);
                setStudent(null);
            }
        };

        if (user) {
            loadStudentData(user);
        } else {
            setStudent(null);
            // Clear localStorage when user logs out
            localStorage.removeItem('studentData');
        }
    }, [user]);

    // Listen to authentication state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signIn = async (email: string, password: string) => {
        try {
            setLoading(true);
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.error('Error signing in:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const signUp = async (email: string, password: string, studentData: Partial<Student>) => {
        try {
            setLoading(true);
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Update user profile
            await updateProfile(user, {
                displayName: `${studentData.first_name} ${studentData.last_name}`
            });

            // Create student document
            const newStudent: Student = {
                ID: parseInt(user.uid) || Date.now(),
                CreatedAt: new Date().toISOString(),
                UpdatedAt: new Date().toISOString(),
                student_id: studentData.student_id || 'STU' + Date.now(),
                first_name: studentData.first_name || 'Student',
                last_name: studentData.last_name || 'User',
                email: email,
                phone_number: studentData.phone_number || '',
                program: studentData.program || 'General Studies',
                year_of_study: studentData.year_of_study || 1,
                is_active: true,
                created_at: new Date().toISOString()
            };

            await setDoc(doc(db, 'students', user.uid), newStudent);
            // Save to localStorage
            localStorage.setItem('studentData', JSON.stringify(newStudent));
            setStudent(newStudent);
        } catch (error) {
            console.error('Error signing up:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            setLoading(true);
            await signOut(auth);
            setStudent(null);
            // Clear localStorage on logout
            localStorage.removeItem('studentData');
        } catch (error) {
            console.error('Error signing out:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const value: FirebaseAuthContextType = {
        user,
        student,
        loading,
        signIn,
        signUp,
        logout,
        isAuthenticated: !!user
    };

    return (
        <FirebaseAuthContext.Provider value={value}>
            {children}
        </FirebaseAuthContext.Provider>
    );
};
