describe('Проверка первого захода на страницу конструктора', () => {
  beforeEach(() => {
    // Перехватываем ответ от сервера и подставляем свой моковый набор ингредиентов
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
    cy.wait('@getUser'); // ждём подтверждение что юзер в системе
  });

  it('добавляет ингредиенты и выводит номер заказа', () => {
    // Добавляем булку
    cy.get('[data-cy="parent-add-button-bun-11"]', { timeout: 10000 })
      .children('button')
      .click();

    // Проверяем, что булка отобразилась
    cy.contains('Булка кукурузно-галюценогенная', {
      timeout: 10000
    }).should('exist');

    // Добавляем начинку
    cy.get('[data-cy="parent-add-button-main-13"]', { timeout: 10000 })
      .children('button')
      .click();

    // Проверяем, что начинка появилась
    cy.contains('Мясо ультрофиолетового сияния', { timeout: 10000 }).should(
      'exist'
    );

    // Нажимаем кнопку оформления
    cy.get('[data-cy="burger-order-btn"]').click();

    // Проверяем, что заказ ушёл
    cy.wait('@createOrder');
    cy.get('[data-cy="modal"]').should('exist');
    cy.contains('121121').should('exist');
  });
});
