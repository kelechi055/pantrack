'use client'; // Enables client-side features

import { useState, useEffect } from 'react';
import { firestore } from '@/firebase'; 
import { Box, Modal, Typography, Stack, TextField, Button, AppBar, Toolbar, IconButton, Link } from '@mui/material';
import { collection, deleteDoc, doc, getDocs, query, setDoc, getDoc } from 'firebase/firestore';
import Image from 'next/image'; 
import { useRouter } from 'next/navigation';

export default function trackerPage() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false); 
  const [itemName, setItemName] = useState('');
  const router = useRouter();

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

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
      {/* Top Navbar */}
      <AppBar position="static" sx={{ backgroundColor: '#212121', padding: '10px 20px' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Left Section: Logo and Pantrack Text */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="logo"
              sx={{ mr: 2 }}
              onClick={() => router.push('/')}
            >
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
                  onClick={() => removeItem(item.name)}
                  color="error"
                >
                  Remove
                </Button>
                <Button
                  variant="contained"
                  onClick={() => addItem(item.name)}
                  color="success"
                >
                  Add
                </Button>
              </Box>
            ))}
          </Box>
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
