import { deleteCookie, getCookie, setCookie } from './cookie';

export const TokenManager = {
  // Сохраняем токены
  saveTokens(accessToken: string, refreshToken: string) {
    // Убираем "Bearer " из accessToken (кукам не нужно)
    const cleanAccessToken = accessToken.replace('Bearer ', '');

    // Кладём accessToken в cookie (для авторизации)
    setCookie('accessToken', cleanAccessToken, { path: '/' });

    // Кладём refreshToken в localStorage (для обновления accessToken)
    localStorage.setItem('refreshToken', refreshToken);
  },

  // Получаем accessToken из cookie
  getAccessToken(): string {
    return getCookie('accessToken') || ''; // Если токена нет — возвращаем пустую строку
  },

  // Получаем refreshToken из localStorage
  getRefreshToken(): string {
    return localStorage.getItem('refreshToken') || '';
  },

  // Полностью очищаем токены при выходе из аккаунта
  clearTokens() {
    deleteCookie('accessToken'); // Удаляем accessToken из cookie
    localStorage.removeItem('refreshToken'); // Удаляем refreshToken из localStorage
  }
};
