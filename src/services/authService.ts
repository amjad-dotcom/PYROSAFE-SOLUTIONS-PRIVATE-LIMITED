export interface AuthUser {
  email: string;
  name: string;
  role: 'Admin' | 'Manager' | 'Staff';
  company: string;
}

const TOKEN_KEY = 'pyrosafe_auth_token_v1';
const USER_KEY = 'pyrosafe_auth_user_v1';

export const ADMIN_CREDENTIALS = {
  email: 'pyrosafesolutions2026@gmail.com',
  passwordHint: 'Ravi@1993'
};

export const authService = {
  getAuthToken(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },

  getCurrentUser(): AuthUser | null {
    try {
      const userStr = localStorage.getItem(USER_KEY);
      if (userStr) {
        return JSON.parse(userStr);
      }
      return null;
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    const token = this.getAuthToken();
    const user = this.getCurrentUser();
    return !!(token && user);
  },

  getAuthHeader(): Record<string, string> {
    const token = this.getAuthToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  async login(email: string, password: string): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    try {
      // First attempt authentication via Express API endpoint
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: cleanPassword })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.token && data.user) {
          localStorage.setItem(TOKEN_KEY, data.token);
          localStorage.setItem(USER_KEY, JSON.stringify(data.user));
          return { success: true, user: data.user };
        }
      }

      if (response.status === 401) {
        const errData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: errData.message || 'Invalid Admin ID or Password. Please check your credentials.'
        };
      }
    } catch (networkErr) {
      console.warn('Backend login endpoint unavailable, checking credentials locally:', networkErr);
    }

    // Direct fallback check if backend server is still spinning up
    if (cleanEmail.toLowerCase() === ADMIN_CREDENTIALS.email.toLowerCase() && cleanPassword === ADMIN_CREDENTIALS.passwordHint) {
      const fallbackUser: AuthUser = {
        email: ADMIN_CREDENTIALS.email,
        name: 'Ravi (Admin)',
        role: 'Admin',
        company: 'PYROSAFE SOLUTIONS PVT LTD'
      };
      const fallbackToken = `pyrosafe_fallback_${Date.now()}`;
      localStorage.setItem(TOKEN_KEY, fallbackToken);
      localStorage.setItem(USER_KEY, JSON.stringify(fallbackUser));
      return { success: true, user: fallbackUser };
    }

    return {
      success: false,
      error: 'Invalid Admin credentials. Please verify your Admin ID and Password.'
    };
  },

  logout(): void {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch (e) {
      console.error('Logout error:', e);
    }
  }
};
