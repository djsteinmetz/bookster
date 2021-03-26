import Link from "next/link";
import Cookies from "js-cookie";
import Router from "next/router";
import React, { useEffect } from "react";
import cookie from "cookie";
import { isAdminUser, isLoggedIn } from "helpers/auth.helpers";
import MenuIcon from "@material-ui/icons/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";
import SearchIcon from "@material-ui/icons/Search";
import LoginIcon from "@material-ui/icons/LockOpen";
import RegisterIcon from "@material-ui/icons/PersonAdd";
import LogoutIcon from "@material-ui/icons/ExitToApp";
import HomeIcon from "@material-ui/icons/Home";
import BookIcon from "@material-ui/icons/LibraryBooks";
import MyBooksIcon from "@material-ui/icons/Book";
import AddBookIcon from "@material-ui/icons/AddBox";

import {
  AppBar,
  Button,
  createStyles,
  IconButton,
  InputBase,
  makeStyles,
  Menu,
  MenuItem,
  Theme,
  Toolbar,
  fade,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import { useSearch } from "@/lib/search";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    branding: {
      fontWeight: "bold",
      cursor: "pointer",
      marginRight: theme.spacing(2),
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    search: {
      position: "relative",
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      "&:hover": {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      // marginRight: theme.spacing(2),
      marginLeft: 0,
      width: "100%",
      [theme.breakpoints.up("sm")]: {
        marginLeft: theme.spacing(3),
        width: "auto",
      },
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: "100%",
      position: "absolute",
      pointerEvents: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
    },
    inputRoot: {
      color: "inherit",
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create("width"),
      width: "100%",
      [theme.breakpoints.up("sm")]: {
        width: "20ch",
        "&:focus": {
          width: "35ch",
        },
      },
    },
    list: {
      width: "auto",
    },
  })
);

export default function Nav() {
  const { onSearch } = useSearch();
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [
    mobileAnchorEl,
    setMobileAnchorEl,
  ] = React.useState<null | HTMLElement>(null);
  const classes = useStyles();
  const menuId = "primary-search-account-menu";
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileAnchorEl);

  useEffect(() => {
    const cookies = cookie.parse(document.cookie);
    const token = cookies["bookstr.access_token"];
    const authorized = isLoggedIn(token);
    const _isAdmin = isAdminUser(token);
    setLoggedIn(authorized);
    setIsAdmin(_isAdmin);
  });

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem
        onClick={() => {
          handleMenuClose();
          Router.push("/me");
        }}
      >
        Profile
      </MenuItem>
      <MenuItem
        onClick={() => {
          handleMenuClose();
          Router.push("/me/books");
        }}
      >
        My Books
      </MenuItem>
      <MenuItem
        onClick={() => {
          handleMenuClose();
          Router.push("/me/books/new");
        }}
      >
        Add Book
      </MenuItem>
      <MenuItem
        onClick={() => {
          handleMenuClose();
          Cookies.remove("bookstr.access_token", {
            path: "/",
          });
          Router.push("/");
        }}
      >
        Logout
      </MenuItem>
    </Menu>
  );

  return (
    <div className={classes.root}>
      <AppBar position="static" color="secondary">
        <Toolbar>
          <div className="block md:hidden">
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="open drawer"
              onClick={(e) => setMobileAnchorEl(e.currentTarget)}
            >
              <MenuIcon />
            </IconButton>
          </div>
          <div>
            <Link href="/">
              <Typography className={classes.branding} variant="h5">
                BOOKSTR
              </Typography>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Search Title or Author"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                inputProps={{ "aria-label": "search" }}
                onChange={(e) => {
                  onSearch(e);
                }}
              />
            </div>
          </div>
          <div className="flex-grow"></div>
          {!loggedIn && (
            <div className="hidden md:block">
              <Link href="/login">
                <Button color="inherit">Login</Button>
              </Link>
              <Link href="/register">
                <Button color="inherit">Register</Button>
              </Link>
            </div>
          )}
          {loggedIn && (
            <div>
              <IconButton
                onClick={handleMenuOpen}
                aria-label="account of current user"
                aria-controls="primary-search-account-menu"
                aria-haspopup="true"
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </div>
          )}
        </Toolbar>
        <div className="block md:hidden">
          <Toolbar>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Search Title or Author"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                inputProps={{ "aria-label": "search" }}
                onChange={(e) => {
                  onSearch(e);
                }}
              />
            </div>
          </Toolbar>
        </div>
      </AppBar>
      {renderMenu}
      <Drawer
        className={classes.list}
        anchor="left"
        open={isMobileMenuOpen}
        onClose={() => setMobileAnchorEl(null)}
      >
        <List>
          <ListItem
            button
            onClick={() => {
              setMobileAnchorEl(null);
              Router.push("/");
            }}
          >
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem
            button
            onClick={() => {
              setMobileAnchorEl(null);
              Router.push("/books");
            }}
          >
            <ListItemIcon>
              <BookIcon />
            </ListItemIcon>
            <ListItemText primary="Browse Books" />
          </ListItem>
          {!loggedIn && (
            <div>
              <ListItem
                button
                onClick={() => {
                  setMobileAnchorEl(null);
                  Router.push("/login");
                }}
              >
                <ListItemIcon>
                  <LoginIcon />
                </ListItemIcon>
                <ListItemText primary="Login" />
              </ListItem>
              <ListItem
                button
                onClick={() => {
                  setMobileAnchorEl(null);
                  Router.push("/register");
                }}
              >
                <ListItemIcon>
                  <RegisterIcon />
                </ListItemIcon>
                <ListItemText primary="Register" />
              </ListItem>
            </div>
          )}
        </List>
      </Drawer>
    </div>
  );
}
