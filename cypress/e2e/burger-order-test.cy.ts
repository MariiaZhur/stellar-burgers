describe('Оформление заказа и очистка конструктора', () => {
  beforeEach(() => {
    // Моки для ингредиентов, пользователя и заказа
    cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as(
      'loadIngredients'
    );
    cy.intercept('GET', '**/auth/user', { fixture: 'fake-user.json' }).as(
      'getUser'
    );
    cy.intercept('POST', '**/orders', { fixture: 'order.json' }).as(
      'createOrder'
    );

    // Авторизация
    cy.setCookie('accessToken', 'test-space-token');

    // Заход на страницу
    cy.visit('/');
    cy.wait('@loadIngredients');
    cy.wait('@getUser');
  });

  it('оформляет заказ и показывает номер', () => {
    // Добавляем булку и начинку
    cy.get('[data-cy="parent-add-button-bun-11"]').children('button').click();
    cy.get('[data-cy="parent-add-button-main-13"]').children('button').click();

    // Кликаем "Оформить заказ"
    cy.get('[data-cy="burger-order-btn"]').click();

    // Проверяем модалку и номер заказа
    cy.wait('@createOrder');
    cy.get('[data-cy="modal"]').should('exist');
    cy.contains('121121').should('exist');
  });

  it('закрывает модалку заказа и очищает бургер', () => {
    // Добавляем ингредиенты и оформляем
    cy.get('[data-cy="parent-add-button-bun-11"]').children('button').click();
    cy.get('[data-cy="parent-add-button-main-13"]').children('button').click();
    cy.get('[data-cy="burger-order-btn"]').click();
    cy.wait('@createOrder');
    cy.get('[data-cy="modal"]').should('exist');

    // Закрываем модалку
    cy.get('[data-cy="modalClose"]').click();

    // Проверяем, что закрылась
    cy.get('[data-cy="modal"]').should('not.exist');

    // Проверяем, что бургер пуст
    cy.get('[data-cy="burgerConstructor"]').should(
      'not.contain',
      'Булка кукурузно-галюценогенная'
    );
    cy.get('[data-cy="burgerConstructor"]').should(
      'not.contain',
      'Мясо ультрофиолетового сияния'
    );
  });
});
