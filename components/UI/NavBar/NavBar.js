"use client";
import SearchForm from "@/components/Forms/SearchForm/SearchForm";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const NavBar = ({ user }) => {
  return (
    <nav>
      <div className="container navbar">
        <Link href="/" className="nav_logo">
          <b>I</b>
          <span>mages</span>
        </Link>

        <div className="nav_search">
          <SearchForm />
        </div>

        <div className="nav_menu">
          {!user ? (
            <>
              <button
                className="btn btn_login"
                onClick={() => signIn("google")}
              >
                <i className="material-icons">person</i>
                <span>Log in</span>
              </button>

              <button
                className="btn btn_icon"
                onClick={() => signIn("google", { callbackUrl: "/upload" })}
              >
                <i className="material-icons-outlined">file_upload</i>
                <span>Submit a photo</span>
              </button>
            </>
          ) : (
            <>
              <Link href="/upload" className="btn btn_icon">
                <i className="material-icons-outlined">file_upload</i>
                <span>Submit a photo</span>
              </Link>

              <Link href={`/profile/${user?._id}`} className="avatar">
                <Image
                  src={user?.avatar}
                  alt={user?.name}
                  width={40}
                  height={40}
                  sizes="25vw"
                />
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
