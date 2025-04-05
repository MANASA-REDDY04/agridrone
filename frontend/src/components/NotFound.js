import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <Container className="text-center py-5">
      <div className="my-5">
        <h1 className="display-1 text-primary">404</h1>
        <h2 className="mb-4">Page Not Found</h2>
        <p className="lead mb-5">
          The page you are looking for might have been removed, had its name changed,
          or is temporarily unavailable.
        </p>
        <Button as={Link} to="/" variant="primary" size="lg">
          Return to Home
        </Button>
      </div>
    </Container>
  );
};

export default NotFound;
