'use client';

import { Box, Typography, Button, Container } from '@mui/material';
import { useRouter } from 'next/navigation';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/firebase'; // Import your Firebase functions
import Image from 'next/image'; // Import Image component for Next.js

export default function SignInPage() {
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      router.push('/tracker'); // Redirect to a default page after sign-in
    } catch (error) {
      console.error('Error signing in with Google: ', error);
    }
  };

  return (
    <Container
      maxWidth="100%"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#D18060', // Original background color
        p: 4,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          bgcolor: 'white',
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
          textAlign: 'center',
        }}
      >
        <Image
          src="/google-logo.png" // Path to your Google logo image
          alt="Google Logo"
          width={200}
          height={100}
          style={{ marginBottom: '20px' }} // Add spacing below the logo
        />
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold', color: '#333' }}>
        Create an account
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, color: '#555' }}>
          Access your pantry management tools and more.
        </Typography>
        <Button
          variant="contained"
          onClick={handleGoogleSignIn}
          sx={{
            backgroundColor: '#4285F4',
            color: 'white',
            '&:hover': { backgroundColor: '#357AE8' },
            width: '100%',
            borderRadius: '20px',
            textTransform: 'none',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          Sign in with Google
        </Button>
      </Box>
    </Container>
  );
}
