import { SignedIn, SignedOut, SignIn, SignInButton, SignUpButton, useAuth, UserButton } from '@clerk/clerk-react';

function LoginPage() {
    return (
        /*<div>
            LoginPage
            <SignedOut>
        <SignInButton mode="modal" />
        <SignUpButton mode="modal" />
      </SignedOut>
      {/* Show the user button when the user is signed in *}
      <SignedIn>
        <UserButton />
      </SignedIn>
        </div>*/
        <div className="h-screen hero">
      <SignIn />
    </div>
    )
}

export default LoginPage;