'use client'; // Enables client-side features

import { useState, useEffect } from 'react';
import { firestore, auth } from '@/firebase'; 
import { Box, Modal, Typography, Stack, TextField, Button, AppBar, Toolbar, IconButton, Link, Avatar } from '@mui/material';
import Image from 'next/image'; 
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';

export default function ContactPage() {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Fetch user on component mount
    const unsubscribeAuth = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribeAuth(); // Clean up subscription on unmount
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');

    try {
      // Here you would handle form submission, e.g., sending an email
      setStatus('Message sent successfully!');
      form.reset();
    } catch (error) {
      setStatus('Error sending message.');
    }
  };

  const handleNavClick = (path) => {
    router.push(path);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/'); // Redirect to the home page after sign out
    } catch (error) {
      console.error('Sign out error:', error);
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
            <IconButton edge="start" color="inherit" aria-label="logo" sx={{ mr: 2 }} onClick={() => handleNavClick('/')}>
              <Image src="/pantracklogo.png" alt="Pantrack Logo" width={60} height={60} />
            </IconButton>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
              ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ
            </Typography>
          </Box>

          {/* Centered Navigation Links */}
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
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
        sx={{ backgroundColor: '#D18060', p: 4 }}
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
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold', color: '#333' }}>
            Contact Me ✉️
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 4, color: '#555' }}>
            Any suggestions or inquiries? Feel free to reach out.
          </Typography>

          <form
            onSubmit={handleSubmit}
            style={{ width: '100%' }}
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
              sx={{ backgroundColor: '#4CAF50', '&:hover': { backgroundColor: '#388E3C' } }}
            >
              Send Message
            </Button>
            {status && (
              <Typography variant="body2" sx={{ mt: 2, color: status.startsWith('Error') ? 'red' : 'green' }}>
                {status}
              </Typography>
            )}
          </form>
        </Box>
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
