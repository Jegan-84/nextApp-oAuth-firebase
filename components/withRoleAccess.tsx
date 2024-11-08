import { useRouter } from "next/router";
import { useAuth } from "../contexts/AuthContext";

export function withRoleAccess(
  WrappedComponent: React.ComponentType,
  allowedRoles: string[]
) {
  return (props: any) => {
    const { user } = useAuth();
    const router = useRouter();

    if (!user || !allowedRoles.includes(user.role)) {
      if (typeof window !== "undefined") {
        router.replace("/unauthorized");
      }
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}
