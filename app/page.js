'use client'; // Enables client-side features

import { useState, useEffect } from 'react';
import { Box, Typography, Button, AppBar, Toolbar, IconButton, Link, Avatar } from '@mui/material';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { auth, googleProvider, signInWithPopup, signOut, onAuthStateChanged } from '@/firebase'; // Import your Firebase functions

export default function LandingPage() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Error signing in: ', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  const handleGetStarted = () => {
    if (user) {
      router.push('/tracker');
    } else {
      router.push('/signin'); // Redirect to a sign-in page or show a message
    }
  };

  const handleNavClick = (path) => {
    if (user || path === '/') {
      router.push(path);
    } else {
      router.push('/signin'); // Redirect to a sign-in page or show a message
    }
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
    >
      {/* Navbar */}
      <AppBar position="static" sx={{ backgroundColor: '#212121', padding: '10px 20px' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Left Section: Logo and Pantrack Text */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton edge="start" color="inherit" aria-label="logo" sx={{ mr: 2 }} onClick={() => handleNavClick('/')}>
              <Image src="/pantracklogo.png" alt="Pantrack Logo" width={60} height={60} />
            </IconButton>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
            </Typography>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>  
             ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ
            </Typography>
          </Box>

          {/* Centered Navigation Links */}
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Link
                href="#"
                onClick={() => handleNavClick('/')}
                sx={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', margin: '0 20px' }}
              >
                Home
              </Link>
              <Link
                href="#"
                onClick={() => handleNavClick('/tracker')}
                sx={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', margin: '0 20px' }}
              >
                Tracker
              </Link>
              <Link
                href="#"
                onClick={() => handleNavClick('/contact')}
                sx={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', margin: '0 20px' }}
              >
                Contact
              </Link>
            </Box>
          </Box>

          {/* Google Sign-In Button or User Info */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {!user ? (
              <Button
                variant="contained"
                onClick={handleSignIn}
                sx={{ backgroundColor: '#22C55E', '&:hover': { backgroundColor: '#16A34A' } }}
                style={{ borderRadius: '20px' }}
              >
                Sign In
              </Button>
            ) : (
              <>
                <Avatar
                  alt={user.displayName}
                  src={user.photoURL}
                  sx={{ width: 40, height: 40, marginRight: 2 }}
                />
                <Typography variant="body1" sx={{ color: 'white', marginRight: 2 }}>
                  {user.displayName.split(' ')[0]} {/* Display first name only */}
                </Typography>
                <Button
                  variant="contained"
                  onClick={handleSignOut}
                  sx={{ backgroundColor: '#FF5555', '&:hover': { backgroundColor: '#B73E3E' } }}
                  style={{ borderRadius: '20px' }}
                >
                  Sign Out
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box
        width="100%"
        height="calc(100% - 64px - 50px)" // Adjust for Navbar height and footer height
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        sx={{
          backgroundColor: '#D18060', // Slightly darker background color for contrast
          p: 4,
          textAlign: 'center',
        }}
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          mb={4}
        >
          <Typography variant="h3" mb={2} sx={{ fontWeight: 'bold' }}>
            Pantrack: Transform Your Pantry Management
          </Typography>
          <Typography variant="h6" mb={4}>
            Effortlessly Add and Remove Items with Zero Hassle
          </Typography>
          <Button
            variant="contained"
            color="success"
            size="large"
            onClick={handleGetStarted}
            sx={{
              mt: 2,
              backgroundColor: '#D35A28',
              '&:hover': {
                backgroundColor: '#99401C',
              },
              padding: '10px 20px',
              borderRadius: '20px',
              textTransform: 'none',  
              fontSize: '16px',
              fontWeight: 'bold',
            }}
          >
            Start Tracking!
          </Button>
        </Box>
        <Image src="/staff.png" alt="Staff Image" width={900} height={450} style={{ marginTop: '20px', borderRadius: '20px' }} />
      </Box>

      {/* Footer */}
      <Box
        width="100%"
        height="50px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{ backgroundColor: '#212121', color: 'white' }}
      >
        <Typography variant="body2" sx={{ textAlign: 'center' }}>
          © {new Date().getFullYear()} Kelechi Opurum. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}
