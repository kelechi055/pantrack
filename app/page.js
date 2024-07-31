'use client'
import Image from "next/image";
import { useState, useEffect } from 'react';
import { firestore } from "@/firebase";
import { Box, Modal, Typography, Stack, TextField, Button } from "@mui/material";
import { collection, deleteDoc, doc, getDocs, query, setDoc, getDoc } from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false); // Modal is closed initially
  const [itemName, setItemName] = useState('');

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
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }

    await updateInventory(); // Corrected function call
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

    await updateInventory(); // Corrected function call
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false); // Corrected function

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center" // Corrected typo
      gap={2}
      flexDirection="column"
    >
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
            transform: "translate(-50%,-50%)",
          }}
        >
          <Typography variant="h6">Add Item</Typography>
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
      <Typography variant="h1">Pantrack</Typography>
      <Button variant="contained" onClick={handleOpen}>
        Add New Item
      </Button>
      <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
        {inventory.map((item) => (
          <Stack
            key={item.name}
            direction="row"
            spacing={2}
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6">{item.name}</Typography>
            <Typography variant="body1">Quantity: {item.quantity}</Typography>
            <Button
              variant="outlined"
              onClick={() => removeItem(item.name)}
              color="error" // Makes the button red
            >
              Remove
            </Button>
            <Button
              variant="outlined"
              onClick={() => addItem(item.name)}
              color="success" // Makes the button green
            >
              Add
          </Button>
          </Stack>
        ))}
      </Box>
    </Box>
  );
}
