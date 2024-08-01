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

export default function TrackerPage() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false); 
  const [itemName, setItemName] = useState('');
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState([]); 
  const [loadingRecipes, setLoadingRecipes] = useState(false); 
  const router = useRouter();


  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider(); 
  
    try {
      const result = await signInWithPopup(auth, provider); 
      const user = result.user; 
      setUser(user); 
      router.push('/tracker'); 
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };
  
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

    return () => unsubscribeAuth(); 
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
      router.push('/'); 
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // Function for updating the users inventory
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

  
  const getFirstName = (fullName) => {
    if (fullName) {
      const nameParts = fullName.split(' ');
      return nameParts[0]; 
    }
    return '';
  };


  const fetchRecipes = async () => {
    const apiKey = 'f290ea3c4c8e493eaa84c32f30ed1572'; 
    const ingredients = inventory.map(item => item.name).join(','); // Converts the users pantry items to a comma-separated list

    setLoadingRecipes(true); 

    try {
      const response = await axios.get(
        `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=5&apiKey=${apiKey}`
      );

      setRecipes(response.data); // Stores the list of recipes in state
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setRecipes([]); 
    } finally {
      setLoadingRecipes(false); 
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
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
          </Box>

          {/* Google Sign-In Button or User Info */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {!user ? (
              <Button
                variant="contained"
                onClick={handleSignIn}
                sx={{ backgroundColor: '#22C55E', '&:hover': { backgroundColor: '#16A34A' } }}
                style={{ borderRadius: '20px' }}
              >
                Sign In
              </Button>
            ) : (
              <>
                <Avatar
                  alt={user.displayName}
                  src={user.photoURL}
                  sx={{ width: 40, height: 40, marginRight: 2 }}
                />
                <Typography variant="body1" sx={{ color: 'white', marginRight: 2 }}>
                  {user.displayName.split(' ')[0]} {/* Displays first name only */}
                </Typography>
                <Button
                  variant="contained"
                  onClick={handleSignOut}
                  sx={{ backgroundColor: '#FF5555', '&:hover': { backgroundColor: '#B73E3E' } }}
                  style={{ borderRadius: '20px' }}
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
        bgcolor="#f5f5f5"
      >
        <br></br>
        <br></br>
        {/* Inventory Section */}
        <Box width="60%" p={2} bgcolor="white" borderRadius={4} boxShadow={2}>
  <Typography variant="h4" spacing={2} mb={2}>
    Your Pantry
  </Typography>
  <Stack direction="row" spacing={2} mb={2}>
    <TextField
      variant="outlined"
      label="Add an item"
      fullWidth
      value={itemName}
      onChange={(e) => setItemName(e.target.value)}
      onKeyPress={(e) => e.key === 'Enter' && addItem(itemName)} 
    />
    <Button variant="contained" color="primary" onClick={() => addItem(itemName)}>
      Add
    </Button>
  </Stack>

  <List>
    {inventory.map((item) => (
      <ListItem key={item.name} sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
        <ListItemText
          primary={item.name}
          secondary={`Quantity: ${item.quantity}`}
        />
        {/* Buttons to increase and decrease quantity */}
        <Button
            variant="contained"
            color="error"
            onClick={() => removeItem(item.name, true)} 
            style={{
              borderRadius: '50%', 
              width: '40px',       
              height: '40px',      
              minWidth: '40px',    
              padding: 0,          
            }}
          >
            -
          </Button>
          <Typography variant="body1" sx={{ mx: 2 }}>
            {item.quantity}
          </Typography>
          <Button
            variant="contained"
            color="success"
            onClick={() => addItem(item.name, true)} 
            style={{
              borderRadius: '50%', 
              width: '40px',       
              height: '40px',      
              minWidth: '40px',    
              padding: 0,          
            }}
          >
            +
          </Button>

      </ListItem>
    ))}
  </List>
</Box>


        {/* Recipe Suggestions Section */}
        <Box width="60%" p={2} bgcolor="white" borderRadius={4} boxShadow={2} mt={4}>
          <Typography variant="h4" mb={2}>
            Suggested Recipes
          </Typography>

          {/* Button to fetch recipes */}
          <Button
            variant="contained"
            color="primary"
            onClick={fetchRecipes}
            disabled={loadingRecipes}
          >
            {loadingRecipes ? 'Loading Recipes...' : 'Get Recipes'}
          </Button>

          {/* Recipe List */}
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
      <br></br>
      <br></br>
      {/* Footer */}
      <Box
        component="footer"
        sx={{
          width: '100%',
          backgroundColor: '#212121',
          color: '#ffffff',
          p: 2,
          textAlign: 'center',
        }}
      >
        <Typography variant="body2" component="p">
          &copy; {new Date().getFullYear()} Pantrack. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}
