'use client'; // Enables client-side features

import { Box, Typography, Button, AppBar, Toolbar, IconButton, Link } from '@mui/material';
import { useRouter } from 'next/navigation'; 
import Image from 'next/image';


export default function LandingPage() {
  const router = useRouter();

  const handleGetStarted = () => {
    // Navigate to the inventory page
    router.push('/tracker');
  };

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
  <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    {/* Left Section: Logo and Pantrack Text */}
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <IconButton edge="start" color="inherit" aria-label="logo" sx={{ mr: 2 }}>
        <Image src="/pantracklogo.png" alt="Pantrack Logo" width={60} height={60} />
      </IconButton>
      <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
        Pantrack
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
  </Toolbar>
</AppBar>

      {/* Main Content */}
      <Box
        width="100%"
        height="calc(100% - 64px - 80px)" // Adjust for Navbar height and footer height
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
            Get Started!
          </Button>
        </Box>
        <Image src="/staff.png" alt="Staff Image" width={900} height={450} style={{ marginTop: '20px' }} />
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
