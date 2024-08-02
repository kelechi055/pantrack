'use client';

import { Box, Typography, Button, Container } from '@mui/material';
import { useRouter } from 'next/navigation';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/firebase'; 
import Image from 'next/image'; 
import { Analytics } from "@vercel/analytics/react"

export default function SignInPage() {
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      router.push('/tracker'); 
    } catch (error) {
      console.error('Error signing in with Google: ', error);
    }
  };

  return (
    <Container
      maxWidth="false"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundImage: 'url(/loginbg.png)', 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat', 
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
          src="/google-logo.png" 
          alt="Google Logo"
          width={200}
          height={100}
          style={{ marginBottom: '20px' }} 
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
