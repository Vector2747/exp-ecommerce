import { SignedIn, SignedOut, SignInButton, SignUpButton, useAuth, UserButton } from '@clerk/clerk-react';

function LoginPage() {
    return (
        <div>
            LoginPage
            <SignedOut>
        <SignInButton mode="modal" />
        <SignUpButton mode="modal" />
      </SignedOut>
      {/* Show the user button when the user is signed in */}
      <SignedIn>
        <UserButton />
      </SignedIn>
        </div>
    )
}

export default LoginPage;