import Head from "next/head";
import Link from "next/link";

import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Grid } from "@mui/material";

interface LayoutProps {
  children?: React.ReactNode;
}

const pageMeta = {
  title: "Mood Stats",
  description: "Test",
  image: "/og.png",
};

export default function Layout({ children }: LayoutProps) {

  const supabaseClient = useSupabaseClient<any>();
  const user  = useUser();

  return (
    <>
      <Head>
        <title>{pageMeta.title}</title>
        <meta name="robots" content="follow, index" />
        <meta content={pageMeta.description} name="description" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={pageMeta.title} />
        <meta property="og:description" content={pageMeta.description} />
        <meta property="og:title" content={pageMeta.title} />
        <meta property="og:image" content={pageMeta.image} />
      </Head>
      <Grid container>
        <Grid item xs={12}>
          { user ? (
            <Box sx={{ flexGrow: 1 }}>
              <AppBar
                position="static"
                color="default"
                elevation={0}
                sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}`, background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)", borderRadius: 3, border: 0, color: 'white', boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)' }}
              >
                <Toolbar sx={{ flexWrap: 'wrap', justifyContent: "center", padding: "1rem" }}>
                  <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1, marginTop: "1rem", marginBottom: "1rem" }}>
                    <Link href="/" style={{ textDecoration: "none", color: "black" }}>
                      Mood Stats App
                    </Link>
                  </Typography>
                  <nav>
                    <Link
                      href="/list_mood"
                      style={{ textDecoration: "none", color: "black", marginRight: "1.5rem", marginTop: "1rem", marginBottom: "1rem", marginLeft: "1.5rem" }}
                    >
                      View
                    </Link>
                    <Link
                      href="/graph_mood"
                      style={{ textDecoration: "none", color: "black", marginRight: "1.5rem", marginTop: "1rem", marginBottom: "1rem", marginLeft: "1.5rem" }}
                    >
                      Stats
                    </Link>
                    <Link
                      href="/resume_mood"
                      style={{ textDecoration: "none", color: "black", marginRight: "1.5rem", marginTop: "1rem", marginBottom: "1rem", marginLeft: "1.5rem" }}
                    >
                      Ai - Resume
                    </Link>
                  </nav>
                  {
                    user ? (
                      <Button href="#" variant="contained" sx={{ my: 1, mx: 1.5 }} onClick={() => supabaseClient.auth.signOut()} color="error">
                        Log Out
                      </Button>
                    ) : (
                      <Button href="#" variant="contained" sx={{ my: 1, mx: 1.5 }}>
                        Sign In
                      </Button>
                    )
                  }
                </Toolbar>
              </AppBar>
            </Box>
          ) : (
            <Link href="/signin">
              <Button variant="contained" color="primary">
                Sign in
              </Button>
            </Link>
          )}
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <main id="skip">{children}</main>
        </Grid>
      </Grid>
    </>
  );
}
