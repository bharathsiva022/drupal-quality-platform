describe('Shield status check - Dev environment', () => {
  it('should have shield enabled for dev URL', () => {
    const devUrl = 'https://dev-chimuadventures.specbee.site/en'; // URL passed in script

    cy.request({
      method: 'GET',
      url: `${devUrl}/api/config/shield`
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.enabled).to.be.true;
    });
  });
});
