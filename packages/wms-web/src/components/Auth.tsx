import type { ReactNode } from 'react'
import { Navigate } from "react-router";
import { useRequest } from "ahooks";
import useInaccessiblePages from "@/models/useInaccessiblePages.ts";

function PermissionChecker({ children }: { children: ReactNode }) {
  const setInaccessiblePages = useInaccessiblePages((state) =>
    state.setInaccessiblePages
  );
  const { loading, error } = useRequest(
    () =>
      new Promise<{ inaccessiblePages: string[] }>((resolve) => {
        setTimeout(() => {
          resolve({
						inaccessiblePages: ["/shelfs"],
          });
        }, 200);
      }),
    {
      onSuccess({ inaccessiblePages }) {
        setInaccessiblePages(inaccessiblePages);
      },
    }
  );
  if (loading) return "loading...";
  if (error) return error.message;
  return children;
}

export default function LoginChecker({ children }: { children: ReactNode }) {
  const { error, loading } = useRequest(
    () =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            userId: "1",
          });
        }, 200);
      })
  );
  if (loading) return "loading...";
  if (error) return <Navigate to="/login" />;
  return <PermissionChecker>{children}</PermissionChecker>;
}
