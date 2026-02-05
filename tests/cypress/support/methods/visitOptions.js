export function getVisitOptions(overrides= {}){
    const shieldUsername = Cypress.env('SHIELD_USERNAME');
    const shieldPassword = Cypress.env('SHIELD_PASSWORD');
    const hasShield = shieldUsername && shieldPassword;

    return {
        failOnStatusCode: false,
        ...(hasShield && {
            auth: {
                username: shieldUsername,
                password: shieldPassword
            }
        }),
        ...overrides
    };

}