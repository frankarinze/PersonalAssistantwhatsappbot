#!/bin/bash

# Certificate content
CERT_CONTENT="CmQKIAiDxNTm0YaMAxIGZW50OndhIgdjb3NwaXJlUI36x8AGGkAPZ5ZVgMVc5D2N1azqMIU3QDO1cgevpGTRSmwqyAvyS9YCTg+SO5lKR1PvtnJtSyqodgE+tUu0mRnCnZOApUcFEjBtSkXDtrjV9PBas7CbqGopk1Pt4V3B9ypeQXuPTTrcXqbfxtrYaxGwFJO3q84heDA="

# Create the PEM file with proper headers and footers
echo "-----BEGIN CERTIFICATE-----" > certificate.pem
echo "$CERT_CONTENT" >> certificate.pem
echo "-----END CERTIFICATE-----" >> certificate.pem

echo "Certificate has been converted to PEM format and saved as certificate.pem" 