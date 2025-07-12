describe('Проверка первого захода на страницу конструктора', () => {
  beforeEach(() => {
    // Перехватываем ответ от сервера и подставляем свой набор ингредиентов
    cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as(
      'loadIngredients'
    );

    // Перехватываем фейковый вход пользователя
    cy.intercept('GET', '**/auth/user', { fixture: 'fake-user.json' }).as(
      'getUser'
    );

    // Перехватываем заказ заранее, чтобы Cypress успел "услышать" его
    cy.intercept('POST', '**/orders', { fixture: 'order.json' }).as(
      'createOrder'
    );

    // Устанавливаем тестовый accessToken как будто пользователь вошёл
    cy.setCookie('accessToken', 'test-space-token');

    // Открываем главную страницу
    cy.visit('/');
    cy.wait('@loadIngredients');
    cy.wait('@getUser'); // Подтверждаем, что пользователь авторизован
  });

  it('отображает булку и начинку из моков', () => {
    // Проверяем, что загруженные ингредиенты видны на странице
    cy.contains('Булка кукурузно-галюценогенная').should('be.visible');
    cy.contains('Мясо ультрофиолетового сияния').should('exist');
  });
});
