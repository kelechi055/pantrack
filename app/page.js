'use client'; // Enables client-side features

import { useState, useEffect } from 'react';
import { Box, Typography, Button, AppBar, Toolbar, IconButton, Link, Avatar } from '@mui/material';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { auth, signOut, onAuthStateChanged } from '@/firebase'; // Import your Firebase functions
import { Analytics } from "@vercel/analytics/react"

export default function LandingPage() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleSignIn = () => {
    // Redirect to the sign-in page
    router.push('/signin');
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
      router.push('/signin');
    }
  };

  const handleNavClick = (path) => {
    if (user || path === '/') {
      router.push(path);
    } else {
      router.push('/signin');
    }
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      sx={{ overflow: 'hidden' }} // Ensures no overflow
    >
{/* Navbar */}
<AppBar position="static" sx={{ backgroundColor: '#212121', padding: '10px 20px' }}>
  <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    {/* Left Section: Logo and Pantrack Text */}
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <IconButton
        edge="start"
        color="inherit"
        aria-label="logo"
        sx={{ mr: 2 }}
        onClick={() => handleNavClick('/')}
      >
        <Image src="/pantracklogo.png" alt="Pantrack Logo" width={60} height={60} />
      </IconButton>
      <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
        ㅤ  ㅤ ㅤ
      </Typography>
    </Box>

    {/* Centered Navigation Links */}
    <Box sx={{ display: { xs: 'none', md: 'flex' }, flexGrow: 1, justifyContent: 'center' }}>
      <Link
        href="#"
        onClick={() => handleNavClick('/')}
        sx={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', mx: 2 }}
      >
        Home
      </Link>
      <Link
        href="#"
        onClick={() => handleNavClick('/tracker')}
        sx={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', mx: 2 }}
      >
        Tracker
      </Link>
      <Link
        href="#"
        onClick={() => handleNavClick('/contact')}
        sx={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', mx: 2 }}
      >
        Contact
      </Link>
    </Box>

    {/* Google Sign-In Button or User Info */}
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Avatar
        alt={user ? user.displayName : 'User Avatar'}
        src={user ? user.photoURL : '/noaccount.png'}
        sx={{ width: 40, height: 40, marginRight: 2, pointerEvents: 'none' }}
      />
      {!user ? (
        <>
          <Typography variant="body1" sx={{ color: 'white', marginRight: 2 }}>
            Guest
          </Typography>
          <Button
            variant="contained"
            onClick={handleSignIn}
            sx={{
              backgroundColor: '#22C55E',
              '&:hover': { backgroundColor: '#16A34A' },
              borderRadius: '20px',
              display: 'block',
            }}
          >
            Sign In
          </Button>
        </>
      ) : (
        <>
          <Typography variant="body1" sx={{ color: 'white', marginRight: 2 }}>
            {user.displayName.split(' ')[0]}
          </Typography>
          <Button
            variant="contained"
            onClick={handleSignOut}
            sx={{
              backgroundColor: '#FF5555',
              '&:hover': { backgroundColor: '#B73E3E' },
              borderRadius: '20px',
            }}
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
        height="calc(100% - 64px)" 
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        sx={{
          color: 'black',
          backgroundImage: 'url(/test.png)',
          backgroundSize: 'cover', 
          backgroundPosition: 'center', 
          backgroundRepeat: 'no-repeat', 
          position: 'relative', 
          padding: '0 20px', 
        }}
      >
        <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
          <Typography variant="h2" mb={2} sx={{ fontWeight: 'bold', textAlign: 'center' }}>
            Welcome to Pantrack🥕
          </Typography>
          <Typography variant="h6" mb={4} sx={{ textAlign: 'center' }}>
            Effortlessly Add and Remove Items, Find Delicious Recipes, and Track Your Pantry with Zero Hassle
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
              fontSize: '20px',
              fontWeight: 'bold',
              display: 'block', // Ensure it displays correctly
            }}
          >
            Start Tracking!
          </Button>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            textAlign: 'center',
            fontSize: '12px',
            color: 'grey',
            paddingBottom: '10px',
            py: 1, // Adds padding for vertical spacing
          }}
        >
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            textAlign: 'center',
            fontSize: '12px',
            color: 'grey',
            paddingBottom: '10px',
            py: 1, // Adds padding for vertical spacing
          }}
        >
          <Typography variant="body2">
            Built with 💖 by{' '}
            <a
              href="https://www.linkedin.com/in/kelechi-opurum"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'inherit', textDecoration: 'underline' }}
            >
              Kelechi Opurum
            </a>
          </Typography>
        </Box>
        </Box>
      </Box>
    </Box>
  );
}
