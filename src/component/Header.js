import * as React from 'react';
import AppBar from '@mui/material/AppBar';

import Toolbar from '@mui/material/Toolbar';

import Typography from '@mui/material/Typography';


import Container from '@mui/material/Container';




function Header() {

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'Montserrat',
              fontWeight: 500,
              color: 'inherit',
              textDecoration: 'none',
              fontSize:'18px'
            }}
          >
            Youtube Comment Analyzer
          </Typography>

        
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Header;
