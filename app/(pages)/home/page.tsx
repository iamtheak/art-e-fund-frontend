import {signOut} from "@/auth";
import {redirect} from "next/navigation";

export default async function Page() {

  return (
      <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
              <div className="aspect-video rounded-xl bg-muted/50"/>
              <div className="aspect-video rounded-xl bg-muted/50"/>
              <div className="aspect-video rounded-xl bg-muted/50"/>
              <div>
                  <h5>Are you sure you want to sign out?</h5>
                  <form
                      action={async () => {
                          "use server"
                          await signOut({redirectTo:"/login?error=SessionExpired"}).then(()=>{
                              redirect("/login?error=SessionExpired");
                          });
                      }}
                  >
                      <button type="submit">Sign out</button>
                  </form>
              </div>
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min"/>
      </div>
  );
}
