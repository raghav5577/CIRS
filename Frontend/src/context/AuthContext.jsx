import {createContext, useState, useEffect, useContext} from 'react';
import API from '../api/api';

const AuthContext = createContext();

export const AuthProvider = ({children})=>{
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if(storedUser && token){
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    },[]);
    const login = async (email, password) => {
        const { data } = await API.post('/auth/login', { email, password });
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        return data.user;
    };
    // 3. Register Function
    const register = async (userData) => {
        const { data } = await API.post('/auth/register', userData);
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        return data.user;
    };
    // 4. Logout Function
    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };
    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);