import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useUser } from "@/utils/useUser";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import RateReviewIcon from "@mui/icons-material/RateReview";
import CottageIcon from "@mui/icons-material/Cottage";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import ArchiveIcon from "@mui/icons-material/Archive";


export default function Layout({ children, meta: pageMeta }) {
  const router = useRouter();
   const supabaseClient = useSupabaseClient();
     const [anchorEl, setAnchorEl] = useState(null)

   const { user } = useUser();
  const meta = {
    title: "Mood Stats",
    description: "Test",
    cardImage: "/og.png",
    ...pageMeta,
  };

     const open = Boolean(anchorEl);
     const handleClick = (e) => {
       setAnchorEl(e.currentTarget);
     };
     const handleClose = () => {
       setAnchorEl(null);
     };


  const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto",
    },
  }));

  const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }));

  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    "& .MuiInputBase-input": {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create("width"),
      width: "100%",
      [theme.breakpoints.up("sm")]: {
        width: "12ch",
        "&:focus": {
          width: "20ch",
        },
      },
    },
  }));

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name="robots" content="follow, index" />

        <meta content={meta.description} name="description" />
        <meta
          property="og:url"
          content={`https://subscription-starter.vercel.app${router.asPath}`}
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:image" content={meta.cardImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@vercel" />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
        <meta name="twitter:image" content={meta.cardImage} />
      </Head>
      <nav>
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex justify-between align-center flex-row py-4 md:py-6 relative">
            <div className="flex flex-1 justify-end space-x-8">
              {user ? (
                <Box sx={{ flexGrow: 1 }}>
                  <AppBar position="static" sx={{ background: "#2c3e50" }}>
                    <Toolbar>
                      <Tooltip title="Account settings">
                        <IconButton
                          size="large"
                          edge="start"
                          color="inherit"
                          aria-label="open drawer"
                          sx={{ mr: 2 }}
                          aria-controls="basic-menu"
                          aria-haspopup="true"
                          aria-expanded={open ? "true" : undefined}
                          onClick={handleClick}
                        >
                          <MenuIcon />
                        </IconButton>
                      </Tooltip>
                      <Menu
                        anchorEl={anchorEl}
                        id="account-menu"
                        open={open}
                        onClose={handleClose}
                        onClick={handleClose}
                        PaperProps={{
                          elevation: 0,
                          sx: {
                            overflow: "visible",
                            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                            mt: 1.5,
                            "& .MuiAvatar-root": {
                              width: 32,
                              height: 32,
                              ml: -0.5,
                              mr: 1,
                            },
                            "&:before": {
                              content: '""',
                              display: "block",
                              position: "absolute",
                              top: 0,
                              right: 14,
                              width: 10,
                              height: 10,
                              bgcolor: "background.paper",
                              transform: "translateY(-50%) rotate(45deg)",
                              zIndex: 0,
                            },
                          },
                        }}
                        transformOrigin={{
                          horizontal: "right",
                          vertical: "top",
                        }}
                        anchorOrigin={{
                          horizontal: "right",
                          vertical: "bottom",
                        }}
                      >
                        <Link href="/">
                          <MenuItem>
                            <ListItemIcon>
                              <CottageIcon fontSize="small" />
                            </ListItemIcon>
                            Home
                          </MenuItem>
                        </Link>
                        <Link href="/list_mood">
                          <MenuItem>
                            <ListItemIcon>
                              <RateReviewIcon fontSize="small" />
                            </ListItemIcon>
                            View, edit and delete your moods
                          </MenuItem>
                        </Link>
                        <Divider />
                        <Link href="/graph_mood">
                          <MenuItem>
                            <ListItemIcon>
                              <QueryStatsIcon fontSize="small" />
                            </ListItemIcon>
                            Graph, stats and more
                          </MenuItem>
                        </Link>
                        <Link href="/resume_mood">
                          <MenuItem>
                            <ListItemIcon>
                              <ArchiveIcon fontSize="small" />
                            </ListItemIcon>
                            Resume
                          </MenuItem>
                        </Link>

                        <MenuItem
                          onClick={async () => {
                            await supabaseClient.auth.signOut();
                            router.push("/signin");
                          }}
                        >
                          <ListItemIcon>
                            <Logout fontSize="small" />
                          </ListItemIcon>
                          Logout
                        </MenuItem>
                      </Menu>
                      <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{
                          flexGrow: 1,
                          display: { xs: "none", sm: "block" },
                          textAlign: "center",
                          justifyContent: "center",
                        }}
                      >
                        Mood App
                      </Typography>
                      <Search>
                        <SearchIconWrapper>
                          <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                          placeholder="Search…"
                          inputProps={{ "aria-label": "search" }}
                        />
                      </Search>
                    </Toolbar>
                  </AppBar>
                </Box>
              ) : (
                <Link href="/signin">Sign in</Link>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main id="skip">{children}</main>
    </>
  );
}
