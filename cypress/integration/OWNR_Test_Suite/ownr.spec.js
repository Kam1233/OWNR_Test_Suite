/// <reference types="cypress" />
const usButton = 'button[data-cy="US"]'
const caButton = 'button[data-cy="CA"]'
const acceptCookies = '#hs-eu-confirmation-button'
const nextButton = 'button[data-cy="next"]'
const submitButton = 'button[data-cy="submit"]'
const emailField = 'input[type="email"]'
const validEmailID = 'email@valid.com'
const invalidEmailID = 'invalidemail.com'
const unavailableSection = 'div[data-cy="unavailable"]'
const unavailableProvince = 'Manitoba'
const newState = 'button[data-cy="new"]'
const existingState = 'button[data-cy="existing"]'
const selectInc = 'button[data-cy="incorporation"]'
const companyNameTextField = 'div[data-cy="companyNameInput"]'
const confAlert = 'div[class*="RequirementsAlertstyle__Requirement"]'

export const messageTexts = {
 "welcomeMsg" : 'Start a new company or onboard your existing business.',
 "invalidEmailIDError" : 'Please enter a valid email address',
 "successMsg" : "Great! We'll send you an email soon.",
 "businessStructureText" : 'Business Structure',
 "startIncText" : 'About your company',
 "confAlertText" : 'Your name satisfies all legal requirements and has passed preliminary naming search tests.'
}

describe('Validate Ownr application', () => {

  beforeEach(() => {
    cy.visit('https://ownr.co/new')
  })

  it('displays two country names by default', () => {
    cy.get('h3').should('have.text','Get Started')
    cy.get('h6').should('have.text',messageTexts.welcomeMsg)
    cy.get('button').should('have.length', 2)
    cy.get('button').first().should('have.text', 'Canada')
    cy.get('button').last().should('have.text', 'United States')
  })

  it('validates the unavailability in US region', () => {
    cy.get(usButton).click()
    cy.get(acceptCookies).click()
    validateUnavailablePage()
  })

  it('displays the list of provinces to select for Canada region', () => {
    cy.get(caButton).click()
    cy.get(acceptCookies).click()
    cy.contains('Province').should('be.visible')
    cy.get('div[data-cy="province"] p').should('have.text','Ontario')
    cy.get('div[data-cy="province"]').click()
    cy.get('div[data-cy="province-menu"] button').should('have.length',13)
    cy.get(nextButton).should('be.visible')
  })

  it('validates the unavailability in province other than ON,AB and BC', () => {
    cy.get(caButton).click()
    cy.get(acceptCookies).click()
    cy.get('div[data-cy="province"]').click()
    cy.contains(unavailableProvince).click()
    cy.get(nextButton).click()
    validateUnavailablePage()
  })

  it('can select state of business from Business State page',() => {
    navigateToBusinessStrucurePage()
    cy.get('button[class*=Newstyle__BackButton]').click()
    cy.get(existingState).should('be.visible').click()
    cy.contains('Company Search').should('be.visible')
  })

  it('can create a Incorporation',() => {
    navigateToBusinessStrucurePage()
    cy.get(selectInc).click()
    cy.contains(messageTexts.startIncText).should('be.visible')
    cy.get(companyNameTextField).type('My Test Company')
    cy.get(confAlert).should('have.text',messageTexts.confAlertText)
    cy.get(submitButton).click()
  })
  
  function validateUnavailablePage(){
    cy.get(unavailableSection).find('h5').should('have.text','Come Back Soon')
    cy.contains('Email').should('be.visible')
    cy.get(emailField).should('have.attr','placeholder').and('equal','me@example.com')
    cy.get(emailField).type(invalidEmailID)
    cy.contains('Send').click()
    cy.contains(messageTexts.invalidEmailIDError).should('be.visible')
    cy.get(emailField).clear().type(validEmailID)
    cy.contains('Send').click()
    cy.get(unavailableSection).find('form p').should('have.text',messageTexts.successMsg)
  }

  function navigateToBusinessStrucurePage(){
    cy.get(caButton).click()
    cy.get(acceptCookies).click()
    cy.get(nextButton).click()
    cy.get(newState).should('be.visible').click()
    cy.contains(messageTexts.businessStructureText).should('be.visible')
  }
 
  })
