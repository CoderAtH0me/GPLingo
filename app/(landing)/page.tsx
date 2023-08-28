import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <>
      <p>homepage</p>
      <UserButton afterSignOutUrl="/" />
    </>
  );
}
