'use client';

import { Box, Typography, TextField, Button, AppBar, Toolbar, IconButton, Link } from '@mui/material';
import Image from 'next/image'; 
import { useRouter } from 'next/navigation'; 
import { useState } from 'react';

export default function ContactPage() {
  const router = useRouter();
  const [status, setStatus] = useState(''); 

  const handleNavClick = (path) => {
    router.push(path);
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); 

    const formData = new FormData(event.target);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
    };

    try {
      const response = await fetch('https://formspree.io/f/mzzprgzl', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setStatus('Message sent successfully!');
        event.target.reset(); 
      } else {
        setStatus('Error sending message. Please try again.');
      }
    } catch (error) {
      setStatus('Error sending message. Please try again.');
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
      <AppBar position="static" sx={{ backgroundColor: '#333', padding: '10px 20px' }}>
        <Toolbar>
          {/* Logo */}
          <IconButton edge="start" color="inherit" aria-label="logo" sx={{ mr: 2 }} onClick={() => handleNavClick('/')}>
            <Image src="/pantracklogo.png" alt="Pantrack Logo" width={60} height={60} />
          </IconButton>
          {/* Navigation Links */}
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
        sx={{ backgroundColor: '#333', color: 'white' }}
      >
        <Typography variant="body2" sx={{ textAlign: 'center' }}>
          © {new Date().getFullYear()} Kelechi Opurum. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}
