"use client";

import { useRouter } from "next/navigation";
import Button from "./Button"; // Adjust the path to your Button component

type ViewProjectButtonProps = {
  projectKey: string;
};

export default function ViewProjectButton({ projectKey }: ViewProjectButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/dashboard/${projectKey}`);
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleClick}>
      View
    </Button>
  );
}


