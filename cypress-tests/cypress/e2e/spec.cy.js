describe('Spec file 2', () => {
  it('Student List was found successfully', () => {
    cy.wait(4000)
    cy.visit('/')
    cy.get(".text-2xl").contains("Students List")
  })


  it('Student List will not be found. Observe screenshot of why it failed', () => {
    cy.wait(4000)
    cy.visit('/')
    
    cy.get(".text-2xl-will-fail").contains("Students List")
  })
})

