import { createClient } from "@/utils/supabase/server";

const ProfilePage = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">Profile</h1>
        <p className="text-neutral-500">
          Manage your account settings and preferences
        </p>
      </header>

      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden max-w-2xl">
        <div className="p-6 border-b border-neutral-100 bg-neutral-50/50">
          <h2 className="text-lg font-semibold text-neutral-900">
            Personal Information
          </h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-1">
            <label className="text-sm font-medium text-neutral-500">
              Email Address
            </label>
            <p className="text-neutral-900">{user?.email}</p>
          </div>
          <div className="grid grid-cols-1 gap-1">
            <label className="text-sm font-medium text-neutral-500">
              User ID
            </label>
            <p className="text-sm text-neutral-400 font-mono">{user?.id}</p>
          </div>
          <div className="grid grid-cols-1 gap-1">
            <label className="text-sm font-medium text-neutral-500">
              Last Sign In
            </label>
            <p className="text-neutral-900">
              {user?.last_sign_in_at
                ? new Date(user.last_sign_in_at).toLocaleString()
                : "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
