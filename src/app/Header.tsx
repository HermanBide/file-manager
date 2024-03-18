import {
  OrganizationSwitcher,
  SignInButton,
  SignOutButton,
  SignedIn,
  SignedOut,
  UserButton,
  UserProfile,
} from "@clerk/nextjs";
import { Nav } from "./Nav";
import { Button } from "@/components/ui/button";

export const Header = () => {
  return (
    <div className="border-b p-4 bg-gray-50">
      <div className="flex items-center justify-between container mx-auto">
        <div className="font-bold text-2xl text-[#e76f51]">Zipplo</div>
        <div>
          <Nav />
        </div>
        <div>
          <OrganizationSwitcher />
        </div>
        <UserButton />
        <>
          <SignedIn>
            <SignOutButton />
            <Button>Sign out</Button>
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <Button>Sign in</Button>
            </SignInButton>
          </SignedOut>
        </>
      </div>
    </div>
  );
};
