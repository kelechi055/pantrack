'use client';

import { useState, useEffect } from 'react';
import { firestore, auth } from '@/firebase';
import { Box, Modal, Typography, Stack, TextField, Button, AppBar, Toolbar, IconButton, Link, Avatar, List, ListItem, ListItemText, CircularProgress } from '@mui/material';
import { collection, deleteDoc, doc, getDocs, query, setDoc, getDoc } from 'firebase/firestore';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import axios from 'axios';
import { Snackbar, Alert } from '@mui/material';

export default function TrackerPage() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loadingRecipes, setLoadingRecipes] = useState(false);
  const router = useRouter();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setUser(user);
      await updateInventory(user.uid);
      router.push('/tracker');
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await updateInventory(currentUser.uid);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const updateInventory = async (userId) => {
    const snapshot = query(collection(firestore, `users/${userId}/inventory`));
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
    if (item.trim() === '') return;
    const userId = user.uid;
    const docRef = doc(collection(firestore, `users/${userId}/inventory`), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }

    await updateInventory(userId);
  };

  const removeItem = async (item) => {
    const userId = user.uid;
    const docRef = doc(collection(firestore, `users/${userId}/inventory`), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }

    await updateInventory(userId);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleNavClick = (path) => {
    router.push(path);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const getFirstName = (fullName) => {
    if (fullName) {
      const nameParts = fullName.split(' ');
      return nameParts[0];
    }
    return '';
  };

  const fetchRecipes = async () => {
    const apiKey = process.env.NEXT_PUBLIC_RECIPE_API_KEY;
    const ingredients = inventory.map(item => item.name).join(',');
  
    setLoadingRecipes(true);

    try {
      if (ingredients.trim() === '') {
        setSnackbarMessage('No items in your pantry to find recipes.');
        setSnackbarSeverity('info');
        setSnackbarOpen(true);
        return;
      }

      const response = await axios.get(
        `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=5&apiKey=${apiKey}`
      );

      if (response.data.length === 0) {
        setSnackbarMessage('No recipes found with the current ingredients.');
        setSnackbarSeverity('info');
      } else {
        setSnackbarMessage('Recipes successfully loaded!');
        setSnackbarSeverity('success');
      }

      setRecipes(response.data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setSnackbarMessage('Error fetching recipes.');
      setSnackbarSeverity('error');
      setRecipes([]);
    } finally {
      setLoadingRecipes(false);
      setSnackbarOpen(true);
    }
  };

  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        flexGrow={1}
        pb={4} // Add padding to the bottom of the main content
      >
        <br></br>
        <br></br>
        {/* Inventory Section */}
        <Box width="60%" spacing={2} p={2} bgcolor="white" borderRadius={4} boxShadow={2}>
          <Typography variant="h4" spacing={2} mb={2} fontWeight={'bold'}>
            <br></br>
            🍳Your Pantry
          </Typography>
          <Stack direction="row" spacing={2} mb={2}>
            <TextField
              variant="outlined"
              label="Add an item..."
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addItem(itemName)} 
            />
            <Button variant="contained" color="primary" onClick={() => addItem(itemName)}>
              Add
            </Button>
          </Stack>

          <TextField
            variant="outlined"
            label="Search pantry..."
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 2 }}
          />

          <List>
            {filteredInventory.map((item) => (
              <ListItem
                key={item.name}
                sx={{
                  mb: 1,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <ListItemText
                  primary={
                    <Typography sx={{ fontWeight: 'bold', fontSize: '25px'}}>
                      {item.name}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body1">
                      Quantity: {item.quantity}
                    </Typography>
                  }
                />
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => removeItem(item.name)}
                  style={{
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    minWidth: '40px',
                    padding: 0,
                    fontWeight: 'bold',
                  }}
                >
                  -
                </Button>
                <Typography
                  variant="body1"
                  sx={{ mx: 2, fontWeight: 'bold' }} 
                >
                  {item.quantity}
                </Typography>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => addItem(item.name)}
                  style={{
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    minWidth: '40px',
                    padding: 0,
                    fontWeight: 'bold',
                  }}
                >
                  +
                </Button>
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Recipe Suggestions Section */}
        <Box width="60%" p={2} bgcolor="white" borderRadius={4} boxShadow={2} mt={4} mb={4}>
          <Typography sx={{ fontWeight: 'bold', fontSize: '25px'}}>
            Suggested Recipes
          </Typography>
          <br></br>
          <Button
            variant="contained"
            color="primary"
            onClick={fetchRecipes}
            disabled={loadingRecipes}
            spacing={2} mb={2}
          >
            {loadingRecipes ? 'Loading Recipes...' : 'Get Recipes'}
          </Button>
          {loadingRecipes && (
            <Box display="flex" justifyContent="center" mt={2}>
              <CircularProgress />
            </Box>
          )}
          <List>
            {recipes.map((recipe) => (
              <ListItem key={recipe.id} sx={{ mb: 1 }}>
                <ListItemText
                  primary={recipe.title}
                  secondary={`Missing Ingredients: ${recipe.missedIngredientCount}`}
                />
                <Button
                  variant="contained"
                  color="secondary"
                  href={`https://spoonacular.com/recipes/${recipe.title.replace(/ /g, '-')}-${recipe.id}`}
                  target="_blank"
                >
                  View Recipe
                </Button>
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}