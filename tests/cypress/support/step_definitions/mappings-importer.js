import * as loginPage from '../../fixtures/pageObjects/loginPage';
import * as drupalPageObjects from '../../fixtures/pageObjects/durpalPageObjects.json';
import * as layoutBuilder from '../../fixtures/pageObjects/layoutBuilder.json';
import * as taxonomy from '../../fixtures/pageObjects/taxonomy.json';
import * as mediaTypes from '../../fixtures/pageObjects/mediaTypes.json';
import * as user from '../../fixtures/pageObjects/userPermissionRoles.json';
import * as paragraph from '../../fixtures/pageObjects/paragraphType.json';
import * as menuPageObjects from '../../fixtures/pageObjects/menuPageObjects.json'
import * as contentType from '../../fixtures/pageObjects/contentTypePageObject.json';
import * as ckeditor from '../../fixtures/pageObjects/ckEditor.json';
import * as frontend from '../../fixtures/pageObjects/front-end.json';
import * as backend from '../../fixtures/pageObjects/back-end.json';
import * as newUser from '../../fixtures/pageObjects/addUserPage.json';



const selectors = Object.assign(
  ckeditor,
  loginPage,
  drupalPageObjects,
  layoutBuilder,
  taxonomy,
  mediaTypes,
  user,
  paragraph,
  menuPageObjects,
  contentType,
  frontend,
  backend,
  newUser
);

module.exports = selectors;