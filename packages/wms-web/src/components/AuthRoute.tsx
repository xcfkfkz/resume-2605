import type { ReactNode } from "react";
import useInaccessiblePages from "@/models/useInaccessiblePages";

export default function AuthRoute({
  path,
  children,
}: {
  path: string;
  children: ReactNode;
}) {
  const inaccessiblePages = useInaccessiblePages(
    (state) => state.inaccessiblePages
  );
  if (inaccessiblePages?.includes(path)) {
    return <div>无权限</div>;
  } else {
    return children;
  }
}
