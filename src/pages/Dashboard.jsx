import { database } from "../firebase/firebaseConfig";
function Dashboard() {
  console.log("Firebase Database:", database);

  return (
    <div className="w-full h-screen flex items-center justify-center bg-slate-100">
      <div className="glass shadow-glass rounded-3xl px-10 py-8">
        <h1 className="text-4xl font-heading font-bold text-slate-800">
          Meta View Lite
        </h1>

        <p className="mt-3 text-slate-500 text-center">
          Firebase Connected Successfully
        </p>
      </div>
    </div>
  );
}

export default Dashboard;