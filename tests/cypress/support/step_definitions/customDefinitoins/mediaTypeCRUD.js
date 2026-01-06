const {
  Given,
  When,
  Then,
} = require("@badeball/cypress-cucumber-preprocessor");
import * as selectors from "../mappings-importer";

Then("I validate the existance of the media types:", (dataTable) => {
  cy.visit("/admin/structure/media");
  const mediaTypes = dataTable.rawTable.slice(1); // Skip the header row

  // Loop through each media type and check if it exists on the page
  mediaTypes.forEach((mediaType) => {
    cy.contains(selectors.basic_table_locator, mediaType[0]).should("exist"); // Check for the existence of each media type
  });
});

When(
  "I add a document with the name {string} and file {string}",
  (mediaName, mediaFilePath) => {
    cy.addDocument(mediaName, mediaFilePath); // Call the custom command to add a document
  }
);

Then("I should see the {string} in the media library", (mediaName) => {
  cy.filterName(mediaName);
  cy.contains(mediaName).should("exist");
});

Then(
  "I update the {string} for {string} with {string} and assert its presense in the media table",
  (mediaType, mediaName, mediaFile) => {
    cy.updateMediaAndAssert(mediaType, mediaName, mediaFile);
  }
);

Then(
  "I update the {string} for {string} with {string} and alt text {string} and assert its presense in the media table",
  (mediaType, mediaName, mediaFile, altText) => {
    cy.updateMediaAndAssert(mediaType, mediaName, mediaFile, altText);
  }
);

When(
  "I add an image with the name {string}, file {string}, and alt text {string}",
  (mediaName, mediaFilePath, altText) => {
    cy.addImage(mediaName, mediaFilePath, altText); // Call the custom command to add an image
  }
);

When(
  "I add an {string} with the name {string}, file {string}",
  (mediaType, mediaName, mediaFilePath) => {
    cy.addMedia(mediaType, mediaName, mediaFilePath); // Call the custom command to add an image
  }
);

When(
  "I add a remote video with the name {string} and URL {string}",
  (mediaName, videoURL) => {
    cy.addRemoteVideo(mediaName, videoURL); // Call the custom command to add a remote video
  }
);

Then(
  "I should see the remote video in the media library at the top of the table",
  () => {
    cy.assertRemoteVideoAtTop();
  }
);

When(
  "I add and validate a media type {string} with description {string} and source {string}",
  (mediaTypeName, mediaDescription, mediaSource) => {
    cy.addAndVerifyMediaType(mediaTypeName, mediaDescription, mediaSource);
  }
);

Then("I delete the {string} media Type", (mediaTypeName) => {
  cy.deleteMediaType(mediaTypeName);
});

When("I delete the {string} media", (mediaName) => {
  cy.deleteMedia(mediaName);
});

When("I delete the video media", () => {
  cy.deleteMedia();
});
