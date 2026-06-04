export function isAuthorizedAdminRequest(request: Request) {
  const adminToken = process.env.ADMIN_TOKEN;

  if (!adminToken && process.env.NODE_ENV !== "production") {
    return true;
  }

  const url = new URL(request.url);
  const providedToken =
    request.headers.get("x-admin-token") ?? url.searchParams.get("token") ?? "";

  return Boolean(adminToken && providedToken === adminToken);
}
