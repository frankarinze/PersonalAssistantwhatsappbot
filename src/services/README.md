# Google Services Microservices

This folder contains microservices for integrating with Google APIs, including:

- **Google Meet**: Create and manage Google Meet meetings.
- **Google Calendar**: Add and manage events in Google Calendar.
- **Google SSO**: Authenticate users via Google Single Sign-On (OAuth2).

## Files
- `googleService.js`: Contains stub functions for authentication, meeting creation, and calendar event creation.

## How to Extend
- Implement the TODOs in `googleService.js` using the appropriate Google APIs and libraries (e.g., `googleapis`, `passport-google-oauth20`).
- Add additional services as needed for other Google Workspace features.

## Prerequisites
- Set up Google Cloud credentials and OAuth2 client.
- Store sensitive credentials in environment variables or a secure vault. 