'use client';

import { useState, useEffect } from 'react';
import { Box, AppBar, Toolbar, IconButton, Link, Avatar, Typography, TextField, Button } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signOut, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/firebase';
import { Analytics } from "@vercel/analytics/react"

const provider = new GoogleAuthProvider();

export default function ContactPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const [status, setStatus] = useState('');
  const router = useRouter();

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false); // Set loading to false once user state is resolved
    });

    return () => unsubscribeAuth();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  const handleNavClick = (path) => {
    router.push(path);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      const response = await fetch('https://formspree.io/f/mzzprgzl', {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        },
        body: formData
      });

      if (response.ok) {
        setStatus('Message sent successfully!');
        e.target.reset();
      } else {
        setStatus('Error sending message.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setStatus('Error sending message.');
    }
  };

  return (
    <Box
      sx={{
        backgroundImage: 'url(/pantry.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        overflow: 'auto',
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column"
      }}
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
            {loading ? (
              <Typography variant="body1" sx={{ color: 'white' }}>
                Loading...
              </Typography>
            ) : (
              <>
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
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box
        width="100%"
        height="calc(100% - 64px - 50px)"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
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
          width="100%"
          maxWidth="600px"
          p={4}
          bgcolor="#ffffff"
          borderRadius={3}
          boxShadow={6}
          display="flex"
          flexDirection="column"
          gap={3}
          alignItems="center"
        >
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
            Contact Me ✉️
          </Typography>

          <Typography variant="body1" sx={{ mb: 4 }}>
            Any suggestions or inquiries? Feel free to reach out to using the form below.
          </Typography>

          <form
            onSubmit={handleSubmit}
            style={{ width: '100%', maxWidth: '600px' }}
          >
            <TextField
              variant="outlined"
              label="Name"
              name="name"
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            <TextField
              variant="outlined"
              label="Email"
              name="email"
              type="email"
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            <TextField
              variant="outlined"
              label="Message"
              name="message"
              multiline
              rows={4}
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
            >
              Send
            </Button>
            {status && (
              <Typography variant="body2" sx={{ mt: 2, color: status.startsWith('Error') ? 'red' : 'green' }}>
                {status}
              </Typography>
            )}
          </form>
        </Box>
      </Box>
    </Box>
  );
}
