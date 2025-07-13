import { selectors } from '../support/selectors';

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
    cy.get(selectors.addBunButton, { timeout: 10000 })
      .children('button')
      .click();

    // Проверяем, что булка отобразилась
    cy.contains(selectors.bunName, { timeout: 10000 }).should('exist');

    // Добавляем начинку
    cy.get(selectors.addMainButton, { timeout: 10000 })
      .children('button')
      .click();

    // Проверяем, что начинка появилась
    cy.contains(selectors.mainName, { timeout: 10000 }).should('exist');

    // Нажимаем кнопку оформления
    cy.get(selectors.orderButton).click();

    // Проверяем, что заказ ушёл
    cy.wait('@createOrder');
    cy.get(selectors.modal).should('exist');
    cy.contains('121121').should('exist');
  });
});
