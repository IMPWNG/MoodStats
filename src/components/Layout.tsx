import Head from "next/head";
import Link from "next/link";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useState } from "react";

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
  const user = useUser();
  const [openMenu, setOpenMenu] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);

  const handleLogout = async () => {
    const { error } = await supabaseClient.auth.signOut();
    if (error) console.log("Error logging out:", error.message);
  };

  const handleMenu = () => {
    setOpenMenu(!openMenu);
  };


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
      <header>
        <nav className="bg-gradient-to-r from-pink-400 via-red-500 to-yellow-500 border-b border-gray-300">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div>
              <Link href="/">
                <p className="text-black font-bold text-xl">
                  Mood Stats App
                </p>
              </Link>
            </div>
            <div>
              {
                user ? (
                  <nav className="hidden md:flex items-center">
                    <Link href="/list_mood">
                      <p className="text-black mx-4 hover:text-gray-700">
                        View
                      </p>
                    </Link>
                    <Link href="/graph_mood">
                      <p className="text-black mx-4 hover:text-gray-700">
                        Stats
                      </p>
                    </Link>
                    <Link href="/resume_mood">
                      <p className="text-black mx-4 hover:text-gray-700">
                        Ai - Resume
                      </p>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Log Out
                    </button>
                  </nav>
                ) : (
                  <nav className="hidden md:flex items-center">
                    <Link href="/signin">
                      <p className="text-black mx-4 hover:text-gray-700">
                        Sign In
                      </p>
                    </Link>
                  </nav>
                )
              }
              <div className="flex md:hidden" onClick={handleMenu}>
                <button type="button" className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" id="options-menu" aria-haspopup="true" aria-expanded="true" onClick={() => setOpenDropdown(!openDropdown)}>

                  <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M2.293 7.293a1 1 0 011.414 0L10 13.586l6.293-6.293a1 1 0 011.414 1.414l-7 7a1 1 0 01-1.414 0l-7-7a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <div className={`md:hidden ${openMenu ? "block" : "hidden"}`}>
                <div className={`${openDropdown ? "block" : "hidden"} origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none`} role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                  <Link href="/list_mood">
                    <p className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">View</p>
                  </Link>
                  <Link href="/graph_mood">
                    <p className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">Stats</p>
                  </Link>
                  <Link href="/resume_mood">
                    <p className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">Ai - Resume</p>
                  </Link>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">Log Out</button>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
      {/* //create the main content with a height of 100% */}
      <main className="flex flex-col items-center justify-center min-h-screen">

     
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col items-center justify-center">
            <div id="content" className="flex flex-col items-center justify-center">
              {children}
            </div>
          </div>
        </div>
      </main>
      {/* <footer className="bg-gradient-to-r from-pink-400 via-red-500 to-yellow-500 border-t border-gray-300">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">
              &copy; 2021 Mood Stats App. All rights reserved.
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">
              <a
                href=""
                className="text-black hover:text-gray-700"
              >
                Made with ❤️ by IMPWNG
              </a>
            </p>
          </div>
        </div>
      </footer> */}
    </>
  );
}
