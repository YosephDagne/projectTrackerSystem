"use client";

import { useRouter } from "next/navigation";
import Button from "./Button"; // Adjust the path to your Button component

type ViewProjectButtonProps = {
  projectId: string;
};

export default function ViewProjectButton({ projectId }: ViewProjectButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/dashboard/projects/${projectId}`);
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleClick}>
      Edit
    </Button>
  );
}


