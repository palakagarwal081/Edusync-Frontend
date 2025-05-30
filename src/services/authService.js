import API from '../services/apiService';

const authService = {
    login: async (email, password) => {
        try {
            const res = await API.post('/auth/login', { email, password });
            if (res.data && res.data.token) {
                // Ensure token is properly formatted
                const token = res.data.token.startsWith('Bearer ') ? res.data.token : `Bearer ${res.data.token}`;
                localStorage.setItem('token', token);
                localStorage.setItem('role', res.data.role);
                localStorage.setItem('userId', res.data.userId);
                localStorage.setItem('userName', res.data.name);
                
                // Log token details for debugging
                console.log('Token stored:', {
                    token: 'Present',
                    role: res.data.role,
                    userId: res.data.userId,
                    name: res.data.name
                });
                
                return {
                    success: true,
                    token: token,
                    role: res.data.role,
                    name: res.data.name,
                    userId: res.data.userId
                };
            } else {
                console.error('Invalid login response:', res.data);
                return {
                    success: false,
                    message: 'Invalid response from server'
                };
            }
        } catch (err) {
            console.error('Login error:', err);
            return {
                success: false,
                message: err.response?.data?.message || 'Login failed. Please check your credentials.'
            };
        }
    },

    register: async (user) => {
        try {
            const res = await API.post('/auth/register', user);
            if (res.data && res.data.token) {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('role', res.data.role);
                localStorage.setItem('userId', res.data.userId);
                localStorage.setItem('userName', res.data.name);
                return { 
                    success: true,
                    token: res.data.token,
                    role: res.data.role,
                    name: res.data.name,
                    userId: res.data.userId,
                    redirectTo: res.data.redirectTo
                };
            } else {
                return {
                    success: false,
                    message: 'Invalid response from server'
                };
            }
        } catch (err) {
            console.error('Registration error:', err);
            const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
            return {
                success: false,
                message: errorMessage
            };
        }
    },
};

export default authService;
