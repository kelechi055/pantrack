'use client'; 

import { Box, Typography, TextField, Button, AppBar, Toolbar, IconButton, Link } from '@mui/material';
import Image from 'next/image'; 
import { useRouter } from 'next/navigation'; 


export default function ContactPage() {
  const router = useRouter();
  const handleNavClick = (path) => {
    router.push(path);
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
        <Toolbar>
          {/* Logo */}
          <IconButton edge="start" color="inherit" aria-label="logo" sx={{ mr: 2 }} onClick={() => handleNavClick('/')}>
            <Image src="/pantracklogo.png" alt="Pantrack Logo" width={60} height={60} />
          </IconButton>
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', mr: 2 }}>
            Pantrack
          </Typography>
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
        height="calc(100% - 64px - 50px)" // Adjust for Navbar height and footer height
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        sx={{ backgroundColor: '#D18060', p: 4 }}
      >
        <Box
          width="100%"
          maxWidth="800px"
          p={4}
          bgcolor="#ffffff"
          borderRadius={2}
          boxShadow={3}
          display="flex"
          flexDirection="column"
          gap={2}
          alignItems="center"
        >
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
            Contact Me ✉️
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 4 }}>
            Any suggestions or inquiries? Feel free to reach out to using the form below.
          </Typography>

          <form
            action="https://formspree.io/f/mzzprgzl" // Replace with your Formspree form ID
            method="POST"
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
