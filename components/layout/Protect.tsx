import { getAuth } from "@/services/auth";
import Link from "next/link";

export default async function Protect({
  permission = "user",
  same = { status: false, user: "" },
  children,
}) {
  const session = await getAuth();
  const className = "pad w-full min-h-[70vh] flex-center";

  if (!session.isLoged) {
    return (
      <div className={className + "gap-2"}>
        <h1 className="text-size-2 font-medium capitalize text-danger">
          not logged in!
        </h1>
        <p className="text-size-5">
          this page requires you to be logged in, to login{" "}
          <Link className="text-accent underline divide-accent" href={`/login`}>
            click here
          </Link>
        </p>
      </div>
    );
  } else if (session.role === "user" && permission === "admin") {
    console.log("here, permissions");
    return (
      <div className={className + "gap-2"}>
        <h1 className="text-size-2 font-medium capitalize text-danger">
          no permission!
        </h1>
        <p className="text-size-5">you are not allowed to access this page</p>
      </div>
    );
  } else if (same.status && same.user !== session.username) {
    return (
      <div className={className + "gap-2"}>
        <h1 className="text-size-2 font-medium capitalize text-danger">
          no permission!
        </h1>
        <p className="text-size-5">you are not allowed to access this page</p>
      </div>
    );
  } else {
    return children;
  }
}
