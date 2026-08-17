import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import AdminLoginForm from "./login-form";

export default async function AdminLoginPage() {
  if (await isAuthenticated()) {
    redirect("/admin");
  }
  return <AdminLoginForm />;
}
