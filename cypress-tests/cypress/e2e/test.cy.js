describe('Spec file 1', () => {
    it('test case 1', () => {
      cy.wait(4000)
      cy.visit('/')
      cy.get(".text-2xl").contains("Students List")
    })
  
  
    it('test case 2', () => {
      cy.wait(4000)
      cy.visit('/')
      
      
      cy.get(".text-2xl").contains("Students List")
    })
  })