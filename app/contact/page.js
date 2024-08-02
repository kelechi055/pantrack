'use client'; 

import { useState, useEffect } from 'react';
import { Box, AppBar, Toolbar, IconButton, Link, Avatar, Typography, TextField, Button } from '@mui/material';
import Image from 'next/image'; 
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase'; 

export default function ContactPage() {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('');
  const router = useRouter();

  useEffect(() => {
    
    const unsubscribeAuth = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
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
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
    >
      {/* Top Navbar */}
      <AppBar position="static" sx={{ backgroundColor: '#212121', padding: '10px 20px' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Left Section: Logo and Pantrack Text */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton edge="start" color="inherit" aria-label="logo" sx={{ mr: 2 }} onClick={() => router.push('/')}>
              <Image src="/pantracklogo.png" alt="Pantrack Logo" width={60} height={60} />
            </IconButton>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
            ㅤ  ㅤ ㅤ
            </Typography>
          </Box>

          {/* Centered Navigation Links */}
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            <Link
              href="#"
              onClick={() => router.push('/')}
              sx={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', margin: '0 20px' }}
            >
              Home
            </Link>
            <Link
              href="#"
              onClick={() => router.push('/tracker')}
              sx={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', margin: '0 20px' }}
            >
              Tracker
            </Link>
            <Link
              href="#"
              onClick={() => router.push('/contact')}
              sx={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', margin: '0 20px' }}
            >
              Contact
            </Link>
          </Box>

          {/* User Profile Section */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {user && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar alt={user.displayName || 'User'} src={user.photoURL || '/default-avatar.png'} sx={{ mr: 2 }} />
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
              </Box>
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
