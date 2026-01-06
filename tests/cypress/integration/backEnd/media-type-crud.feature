Feature: Managing media and media type

    Background: Admin login
        Given I login to admin dashboard with username 'username' and password 'password'


@smoke @regression_be @sanity
Scenario: Validating the presense of Document, Image and Remote video media typesa are configured
    When I navigate to "/admin/structure/media"
    Then I validate the existance of the media types:
        | MediaType    |
        | Document     |
        | Image        |
        | Remote video |
        | Video        |
    And I logout of the application

@smoke @regression_be @sanity
Scenario: Adding and updating Image media
    When I navigate to "/admin/content/media" 
    And I click on "Add media" button
    When I add an image with the name "Test Image", file "mediaTestData\testimage1.png", and alt text "Test Alt Text"
    Then I should see the "testimage1" in the media library
    And I update the "Image" for "testimage1" with "mediaTestData\testimage2.jpg" and alt text "Updating the image" and assert its presense in the media table
    When I delete the "testimage2" media
    And I logout of the application

@smoke @regression_be @sanity
Scenario: Add a new Remote Video
    When I navigate to "/admin/content/media" 
    And I click on "Add media" button
    And I add a remote video with the name "Test Video" and URL "https://www.youtube.com/watch?v=JLsz_R9il50"
    Then I should see the remote video in the media library at the top of the table
    When I delete the video media
    And I logout of the application

@smoke @regression_be @sanity
Scenario: Adding and updating File media
    When I add an "Document" with the name "Test Document", file "mediaTestData\INX-test-1.pdf"
    Then I should see the "INX-test-1" in the media library
    And I update the "File" for "INX-test-1" with "mediaTestData\INX-test-2.pdf" and alt text "Updating the audio" and assert its presense in the media table
    When I delete the "INX-test-2" media
    And I logout of the application

@smoke @regression_be @sanity
Scenario: Adding and updating Video media
    When I add an "Video" with the name "Test Video", file "mediaTestData\test_video1.mp4"
    Then I should see the "test_video1" in the media library
    And I update the "Video" for "test_video1" with "mediaTestData\test_video2.mp4" and alt text "Updating the video" and assert its presense in the media table
    When I delete the "test_video2" media
    And I logout of the application



