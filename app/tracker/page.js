'use client'; // Enables client-side features

import { useState, useEffect } from 'react';
import { firestore, auth } from '@/firebase'; 
import { Box, Modal, Typography, Stack, TextField, Button, AppBar, Toolbar, IconButton, Link, Avatar } from '@mui/material';
import { collection, deleteDoc, doc, getDocs, query, setDoc, getDoc } from 'firebase/firestore';
import Image from 'next/image'; 
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth'; 

export default function TrackerPage() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false); 
  const [itemName, setItemName] = useState('');
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Fetch user and inventory on component mount
    const unsubscribeAuth = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    const updateInventory = async () => {
      const snapshot = query(collection(firestore, 'inventory'));
      const docs = await getDocs(snapshot);
      const inventoryList = [];
      docs.forEach((doc) => {
        inventoryList.push({
          name: doc.id,
          ...doc.data(),
        });
      });
      setInventory(inventoryList);
    };

    updateInventory();

    return () => unsubscribeAuth(); // Clean up subscription on unmount
  }, []);

  const addItem = async (item) => { 
    if (item.trim() === '') return; // Error checking 
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }

    await updateInventory(); 
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }

    await updateInventory(); 
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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

  // Function to update inventory
  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
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
            </Typography>
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
        height="calc(100% - 64px - 50px)" // Adjust for Navbar height and footer height
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        sx={{
          backgroundColor: '#D18060', 
          p: 4,
        }}
      >
        {/* Nested Management Box */}
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
          {/* Introductory Text */}
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            🥕 Pantry Tracker
          </Typography>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'light' }}>
            Keep track of your pantry items and quantities.
          </Typography>

          {/* Modal for Adding New Items */}
          <Modal open={open} onClose={handleClose}>
            <Box
              position="absolute"
              top="50%"
              left="50%"
              width={400}
              bgcolor="white"
              border="2px solid #000"
              boxShadow={24}
              p={4}
              display="flex"
              flexDirection="column"
              gap={3}
              sx={{
                transform: "translate(-50%, -50%)",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Add Item</Typography>
              <Stack width="100%" direction="row" spacing={2}>
                <TextField
                  variant="outlined"
                  label="Item Name"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  fullWidth
                />
                <Button
                  variant="contained"
                  onClick={() => {
                    addItem(itemName);
                    setItemName('');
                    handleClose();
                  }}
                >
                  Add
                </Button>
              </Stack>
            </Box>
          </Modal>
          <Button variant="contained" onClick={handleOpen}>
            Add New Item
          </Button>

          {/* Inventory List */}
          <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
            {inventory.map((item) => (
              <Box
                key={item.name}
                display="flex"
                flexDirection="row"
                alignItems="center"
                mb={2}
                p={2}
                bgcolor="#f5f5f5"
                borderRadius={1}
                boxShadow={1}
                gap={2}
              >
                <Typography variant="h6" sx={{ fontWeight: 'bold', marginRight: 2 }}>
                  {item.name}
                </Typography>
                <Typography variant="body1" sx={{ color: '#757575', marginRight: 2 }}>
                  Quantity: {item.quantity}
                </Typography>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => removeItem(item.name)}
                >
                  Remove
                </Button>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        width="100%"
        display="flex"
        justifyContent="center"
        alignItems="center"
        p={2}
        bgcolor="#212121"
        color="white"
        sx={{ borderTop: '1px solid #333' }}
      >
        <Typography variant="body2" sx={{ textAlign: 'center' }}>
          &copy; {new Date().getFullYear()} Pantrack. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}
